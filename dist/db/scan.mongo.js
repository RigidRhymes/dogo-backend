"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scanSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    social_media: [{
            platform: { type: String },
            handle: { type: String },
            status: { type: String },
            result: { type: String },
        }],
    status: { type: String, enum: ["queued", "completed", "failed"], default: "queued" },
    result: { type: Object },
}, { timestamps: true });
exports.Scan = mongoose_1.default.model("Scan", scanSchema);
