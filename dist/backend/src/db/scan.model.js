"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScan = createScan;
const index_1 = require("./index");
async function createScan(userId, email) {
    const result = await index_1.db.query(`INSERT INTO scans (user_id, email, status, created_at, updated_at)
        VALUES ($1, $2, 'queued', NOW(), NOW()) RETURNING id`, [userId, email]);
    return result.rows[0];
}
