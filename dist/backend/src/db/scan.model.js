"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScan = createScan;
exports.getScan = getScan;
exports.updateScanStatus = updateScanStatus;
exports.updateScanResult = updateScanResult;
const index_1 = require("../db/index");
const scan_mongo_1 = require("./scan.mongo");
async function ensureBreachTable() {
    await (0, index_1.connectDB)();
}
async function createScan(input) {
    await ensureBreachTable();
    const scanId = `scan-${Date.now()}`;
    const newScan = new scan_mongo_1.Scan({
        id: scanId,
        user_id: input.userId,
        email: input.email,
        phone: input.phone,
        social_media: input.social_media ? [input.social_media] : [],
        status: 'queued'
    });
    await newScan.save();
    return { id: scanId };
}
async function getScan(id, userId) {
    await ensureBreachTable();
    const scan = await scan_mongo_1.Scan.findOne({ id: id, user_id: userId }).lean();
    if (!scan)
        return null;
    return {
        id: scan.id,
        user_id: scan.user_id,
        email: scan.email,
        phone: scan.phone,
        social_media: scan.social_media,
        status: scan.status,
        result: scan.result,
        created_at: scan.createdAt,
        updated_at: scan.updatedAt
    };
}
async function updateScanStatus(id, status) {
    await ensureBreachTable();
    const scan = await scan_mongo_1.Scan.findOneAndUpdate({ id: id }, { status: status }, { new: true }).lean();
    if (!scan)
        return null;
    return {
        id: scan.id,
        status: scan.status,
    };
}
async function updateScanResult(id, scanResult, status) {
    await ensureBreachTable();
    const scan = await scan_mongo_1.Scan.findOneAndUpdate({ id: id }, { status: status, result: scanResult }, { new: true }).lean();
    if (!scan)
        return null;
    return {
        id: scan.id,
        status: scan.status,
        result: scan.result,
    };
}
