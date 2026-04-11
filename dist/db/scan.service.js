"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailScan = createEmailScan;
exports.createPhoneScan = createPhoneScan;
exports.createSocialScan = createSocialScan;
const scan_mongo_1 = require("./scan.mongo");
async function createEmailScan(userId, email) {
    const scanId = `scan-${Date.now()}`;
    return await scan_mongo_1.Scan.create({ id: scanId, user_id: userId, email, status: "queued" });
}
async function createPhoneScan(userId, phone) {
    const scanId = `scan-${Date.now()}`;
    return await scan_mongo_1.Scan.create({ id: scanId, user_id: userId, phone, status: "queued" });
}
async function createSocialScan(userId, platform, handle) {
    const scanId = `scan-${Date.now()}`;
    return await scan_mongo_1.Scan.create({
        id: scanId,
        user_id: userId,
        social_media: [{ platform, handle, status: "queued" }]
    });
}
