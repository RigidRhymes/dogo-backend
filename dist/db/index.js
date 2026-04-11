"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGODB_URI;
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
    }
    catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}
