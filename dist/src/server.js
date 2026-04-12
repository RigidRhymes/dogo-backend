"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const scan_route_1 = require("./api/scan.route");
const cors_1 = __importDefault(require("cors"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const requireAuth_1 = require("@/middleware/requireAuth");
const auth_route_1 = require("./api/auth.route");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.use("/auth", auth_route_1.authRouter);
exports.app.use('/api/scan', requireAuth_1.requireAuth, scan_route_1.scanRouter);
exports.app.get("/ai-test", async (req, res) => {
    const prompt = "Summarize risks of using an email found in breach.";
    try {
        const response = await (0, node_fetch_1.default)("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "gemma:2b", prompt }),
        });
        const raw = await response.text();
        const lines = raw.trim().split("\n");
        let fullResponse = "";
        for (const line of lines) {
            try {
                const obj = JSON.parse(line);
                if (obj.response) {
                    fullResponse += obj.response;
                }
            }
            catch {
            }
        }
        res.json({ aiResponse: fullResponse.trim() });
    }
    catch (error) {
        console.error("Error talking to Ollama:", error);
        res.status(500).json({ error: "Failed to connect to Ollama" });
    }
});
