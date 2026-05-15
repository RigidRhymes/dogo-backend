import { db } from './index'

const BREACH_TABLE = 'breachdb'

async function ensureBreachTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS ${BREACH_TABLE} (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL,
            result JSONB,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `)
}

export async function createScan(userId: string, email: string) {
    await ensureBreachTable();

    const scanId = `scan-${Date.now()}`
    const result = await db.query(
        `INSERT INTO ${BREACH_TABLE} (id, user_id, email, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'queued', NOW(), NOW()) RETURNING id`,
        [scanId, userId, email]
    )

    return result.rows[0];
}

export async function getScan(id: string, userId: string) {
    await ensureBreachTable();
    const result = await db.query(
        `SELECT id, user_id, email, status, result, created_at, updated_at FROM ${BREACH_TABLE}
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
    )

    return result.rows[0] ?? null;
}

export async function updateScanStatus(id: string, status: string) {
    await ensureBreachTable();
    const result = await db.query(
        `UPDATE ${BREACH_TABLE}
         SET status = $2, updated_at = NOW()
         WHERE id = $1
         RETURNING id, user_id, email, status, result, created_at, updated_at`,
        [id, status]
    )
    return result.rows[0] ?? null;
}

export async function updateScanResult(id: string, scanResult: unknown, status: string) {
    await ensureBreachTable();
    const result = await db.query(
        `UPDATE ${BREACH_TABLE}
         SET status = $2, result = $3, updated_at = NOW()
         WHERE id = $1
         RETURNING id, user_id, email, status, result, created_at, updated_at`,
        [id, status, scanResult]
    )
    return result.rows[0] ?? null;
}
