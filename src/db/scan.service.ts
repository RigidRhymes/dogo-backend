import { Scan } from "./scan.mongo"

export async function createEmailScan(userId: string, email:string){
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({id: scanId, user_id: userId, email, status: "queued"})
}

export async function createPhoneScan(userId: string, phone: string) {
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({ id: scanId, user_id: userId, phone, status: "queued" });
}

export async function createSocialScan(userId: string, platform: string, handle: string) {
    const scanId = `scan-${Date.now()}`;
    return await Scan.create({
        id: scanId,
        user_id: userId,
        social_media: [{ platform, handle, status: "queued" }]
    });
}