import { Router, Request } from 'express';
import { Scan } from "@/db/scan.mongo";
import { scanEmailRisk } from "./scanEmailRisk";
import {requireAuth} from "@/middleware/requireAuth";




export const scanRouter = Router();

// 1. FIX: Added requireAuth middleware directly to the POST route
scanRouter.post('/', requireAuth, async (req: Request & { user?: { id: string; email?: string } }, res) => {
    const { email } = req.body as { email: string };

    // Safety check: ensure email was actually provided in the request body
    if (!email) {
        return res.status(400).json({ error: 'Email field is required' });
    }

    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized - User profile missing' });
    }

    try {
        const scanId = `scan-${Date.now()}`;
        const scan = await Scan.create({ id: scanId, user_id: userId, email, status: 'queued' });

        // Return JSON immediately to prevent client-side timeouts
        res.status(201).json({ scanId: scan.id });

        // Background worker simulation
        setTimeout(async () => {
            try {
                const riskResult = await scanEmailRisk(email);
                const breaches = riskResult.publicMentions.map((url: string) => ({
                    name: new URL(url).hostname,
                    date: new Date().toISOString(),
                    exposed: ["email"],
                    risk: riskResult.hasGravatar || riskResult.foundOnGitHub ? "High" : "Medium",
                    source: url,
                }));

                const result = {
                    breaches,
                    totalMentions: riskResult.publicMentions.length,
                    signals: {
                        isValid: riskResult.isValid,
                        hasGravatar: riskResult.hasGravatar,
                        foundOnGitHub: riskResult.foundOnGitHub,
                        foundInBreaches: riskResult.foundInBreaches,
                    },
                    summary: riskResult.summary,
                };

                console.log(`Scanning email: ${email}`);
                console.log(`Found ${riskResult.publicMentions.length} mentions`);

                await Scan.findOneAndUpdate(
                    { id: scan.id } as any,
                    { result, status: 'completed' },
                    { new: true } as any
                ).lean();

            } catch (err) {
                console.error("Failed to update scan status", err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                await Scan.findOneAndUpdate(
                    { id: scan.id } as any,
                    { result: { error: errorMessage }, status: 'failed' },
                    { new: true } as any
                ).lean();
            }
        }, 5000);

    } catch (err) {
        console.error('Scan creation failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// 2. GET route remains protected, verify MongoDB filter uses string comparison safely
scanRouter.get('/:id', requireAuth, async (req: Request & { user?: { id: string } }, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const result = await Scan.findOne({ id: id, user_id: userId } as any).lean();
        if (!result) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        return res.json(result);
    } catch (err) {
        console.error('Scan fetch failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
