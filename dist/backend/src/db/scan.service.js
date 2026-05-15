import { Scan } from "./scan.mongo";
export async function createEmailScan(userId, email) {
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({ id: scanId, user_id: userId, email, status: "queued" });
}
export async function createPhoneScan(userId, phone) {
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({ id: scanId, user_id: userId, phone, status: "queued" });
}
export async function createSocialScan(userId, platform, handle) {
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({
        id: scanId,
        user_id: userId,
        social_media: [{ platform, handle, status: "queued" }]
    });
}
