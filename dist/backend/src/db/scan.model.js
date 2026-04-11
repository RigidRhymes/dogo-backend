"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScan = createScan;
exports.getScan = getScan;
exports.updateScanStatus = updateScanStatus;
exports.updateScanResult = updateScanResult;
const index_1 = require("./index");
const BREACH_TABLE = 'breachdb';
async function ensureBreachTable() {
    await index_1.db.query(`
        CREATE TABLE IF NOT EXISTS ${BREACH_TABLE} (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL,
            result JSONB,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);
}
async function createScan(userId, email) {
    await ensureBreachTable();
    const scanId = `scan-${Date.now()}`;
    const result = await index_1.db.query(`INSERT INTO ${BREACH_TABLE} (id, user_id, email, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'queued', NOW(), NOW()) RETURNING id`, [scanId, userId, email]);
    return result.rows[0];
}
async function getScan(id, userId) {
    await ensureBreachTable();
    const result = await index_1.db.query(`SELECT id, user_id, email, status, result, created_at, updated_at FROM ${BREACH_TABLE}
         WHERE id = $1 AND user_id = $2`, [id, userId]);
    return result.rows[0] ?? null;
}
async function updateScanStatus(id, status) {
    await ensureBreachTable();
    const result = await index_1.db.query(`UPDATE ${BREACH_TABLE}
         SET status = $2, updated_at = NOW()
         WHERE id = $1
         RETURNING id, user_id, email, status, result, created_at, updated_at`, [id, status]);
    return result.rows[0] ?? null;
}
async function updateScanResult(id, scanResult, status) {
    await ensureBreachTable();
    const result = await index_1.db.query(`UPDATE ${BREACH_TABLE}
         SET status = $2, result = $3, updated_at = NOW()
         WHERE id = $1
         RETURNING id, user_id, email, status, result, created_at, updated_at`, [id, status, scanResult]);
    return result.rows[0] ?? null;
}
