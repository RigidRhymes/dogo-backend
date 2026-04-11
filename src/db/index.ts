import mongoose from "mongoose";
import * as process from "node:process";
import dotenv from 'dotenv'

dotenv.config({path: ".env.local"})

const MONGO_URI = process.env.MONGODB_URI!;

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}
