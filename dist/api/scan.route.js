"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRouter = void 0;
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const scan_mongo_1 = require("../db/scan.mongo");
const scanEmailRisk_1 = require("./scanEmailRisk");
// This file is for search mentions
exports.scanRouter = (0, express_1.Router)();
exports.scanRouter.post('/', requireAuth_1.requireAuth, async (req, res) => {
    const { email } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const scanId = `scan-${Date.now()}`;
        const scan = await scan_mongo_1.Scan.create({ id: scanId, user_id: userId, email, status: 'queued' });
        res.status(201).json({ scanId: scan.id });
        setTimeout(async () => {
            try {
                const riskResult = await (0, scanEmailRisk_1.scanEmailRisk)(email);
                const breaches = riskResult.publicMentions.map((url) => ({
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
                await scan_mongo_1.Scan.findOneAndUpdate({ id: scan.id }, { result, status: 'completed' }, { new: true }).lean();
            }
            catch (err) {
                console.error("Failed to update scan status", err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                await scan_mongo_1.Scan.findOneAndUpdate({ id: scan.id }, { result: { error: errorMessage }, status: 'failed' }, { new: true }).lean();
            }
        }, 5000);
    }
    catch (err) {
        console.error('Scan creation failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
exports.scanRouter.get('/:id', requireAuth_1.requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await scan_mongo_1.Scan.findOne({ id, user_id: req.user?.id }).lean();
        if (!result) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        return res.json(result);
    }
    catch (err) {
        console.error('Scan fetch failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
