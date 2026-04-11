import mongoose, { Schema, Document } from "mongoose";

interface Scan extends Document {
    userId: string;
    email: string;
    status: string;
    result?: any;
    createdAt: Date;
    updatedAt: Date;
}

const ScanSchema = new Schema<Scan>(
    {
        userId: { type: String, required: true },
        email: { type: String, required: true },
        status: { type: String, default: "queued" },
        result: { type: Object },
    },
    { timestamps: true }
);

export const ScanModel = mongoose.model<Scan>("Scan", ScanSchema);

export async function createScan(userId: string, email: string) {
    const scan = new ScanModel({ userId, email, status: "queued" });
    return await scan.save();
}

export async function getScan(id: string, userId: string) {
    return await ScanModel.findOne({ _id: id, userId });
}

export async function updateScanResult(id: string, result: any, status: string) {
    return await ScanModel.findByIdAndUpdate(
        id,
        { result, status },
        { new: true }
    );
}
