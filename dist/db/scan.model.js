"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanModel = void 0;
exports.createScan = createScan;
exports.getScan = getScan;
exports.updateScanResult = updateScanResult;
const mongoose_1 = __importStar(require("mongoose"));
const ScanSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: "queued" },
    result: { type: Object },
}, { timestamps: true });
exports.ScanModel = mongoose_1.default.model("Scan", ScanSchema);
async function createScan(userId, email) {
    const scan = new exports.ScanModel({ userId, email, status: "queued" });
    return await scan.save();
}
async function getScan(id, userId) {
    return await exports.ScanModel.findOne({ _id: id, userId });
}
async function updateScanResult(id, result, status) {
    return await exports.ScanModel.findByIdAndUpdate(id, { result, status }, { new: true });
}
