"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRouter = void 0;
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const scan_model_1 = require("../db/scan.model");
const db_1 = require("../db");
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
        const scan = await (0, scan_model_1.createScan)(userId, email);
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
                await db_1.db.query(`UPDATE scans SET status = 'completed', updated_at = NOW(), result = $2 WHERE id = $1`, [scan.id, JSON.stringify(result)]);
            }
            catch (err) {
                console.error("Failed to update scan status", err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                await db_1.db.query(`UPDATE scans SET status = 'failed', updated_at = NOW(), result = $2 WHERE id = $1`, [scan.id, JSON.stringify({ error: errorMessage })]);
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
        const result = await db_1.db.query(`SELECT * FROM scans WHERE id= $1 AND user_id = $2`, [id, req.user?.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Scan fetch failed:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
