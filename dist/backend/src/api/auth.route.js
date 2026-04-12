"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../db/user.model"));
exports.authRouter = (0, express_1.Router)();
// Register new user
exports.authRouter.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await user_model_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ error: "Email already registered" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.default({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Login existing user
exports.authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid credentials" });
        const payload = { id: user._id, email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
            algorithm: "HS256",
        });
        res.json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
