import { connectDB } from "@/db/index";
import {Scan} from './scan.mongo'

async function ensureBreachTable(){
    await connectDB();
}

interface CreateScanInput{
    userId: string;
    email?: string;
    phone?: string;
    social_media?: { platform: string; handle: string };
}

export async function createScan(userId: string, email: string, ){
    await ensureBreachTable();
    const scanId = `scan-${Date.now()}`;

    const newScan = new Scan({
        id: scanId,
        user_id: input.userId,
        email: input.email,
        phone: input.phone,
        social_media: input.social_media ? [input.social_media] : [],
        status: 'queued'
    });

    await newScan.save();
    return { id: scanId }
}

export async function getScan(id: string, userId: string){
    await ensureBreachTable();

    const scan = await Scan.findOne({id: id, user_id: userId}).lean();
    if (!scan ) return null;

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

export async function updateScanStatus(id: string, status: string ){
    await ensureBreachTable();

    const scan = await Scan.findOneAndUpdate(
        {id: id },
        {status: status},
        {new: true }
    ).lean();

    if(!scan) return null;

    return {
        id: scan.id,
        status: scan.status,
    };
}

export async function updateScanResult(id: string, scanResult: unknown, status: string ){
    await ensureBreachTable();

    const scan = await Scan.findOneAndUpdate(
        {id: id},
        {status: status, result: scanResult},
        {new: true}
    ).lean();

    if (!scan) return null;

    return {
        id: scan.id,
        status: scan.status,
        result: scan.result,
    };
}