import { Router, Request } from 'express';

import { createScan, getScan, updateScanResult } from "@/db/scan.model";
import { scanEmailRisk } from "./scanEmailRisk"
import {requireAuth} from "@/middleware/requireAuth";


// This file is for search mentions
export const scanRouter = Router();

scanRouter.post('/', requireAuth, async (req: Request & { user?: { id: string; email?: string } }, res) => {
    const { email } = req.body as { email: string };
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const scan = await createScan(userId, email)
        res.status(201).json({ scanId: scan.id })

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

                await updateScanResult(scan.id, result, 'completed');
            } catch (err) {
                console.error("Failed to update scan status", err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                await updateScanResult(scan.id, { error: errorMessage }, 'failed');
            }
        }, 5000);

    } catch (err) {
        console.error('Scan creation failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

scanRouter.get('/:id', requireAuth, async (req: Request & {user?: {id: string} }, res) => {
    const {id} = req.params;

    try {
        const result = await getScan(id, req.user?.id as string);

        if (!result) {
            return res.status(404).json({ error: 'Scan not found' })
        }
        return res.json(result);
    } catch (err) {
        console.error('Scan fetch failed:', err);
        return res.status(500).json({ error: 'Database error' })
    }
})

