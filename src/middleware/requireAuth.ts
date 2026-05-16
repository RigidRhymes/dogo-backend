import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

export default async function requireAuth (req: Request, res: Response, next: NextFunction){
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("requireAuth blocked: Missing or invalid authorization header prefix.");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const parts = authHeader.split(" ");
        const tokenValue = parts[1];
        if (!tokenValue || tokenValue === "undefined") {
            console.warn("requireAuth blocked: Forwarded token string is empty or undefined.");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const db = mongoose.connection.db;
        if (!db) {
            console.error("requireAuth blocked: Database connection socket is unavailable");
            return res.status(500).json({ error: "Internal Authentication system failure" });
        }

        // 1. FIX: Better Auth uses the raw session token as the document '_id' or 'id' field
        let activeSession = await db.collection("session").findOne({ id: tokenValue });
        if (!activeSession) {
            activeSession = await db.collection("session").findOne({ _id: tokenValue as any });
        }

        if (!activeSession) {
            console.warn("Direct DB check Failed: Token not found inside session collection table", tokenValue);
            return res.status(401).json({ error: "Unauthorized Active Session" });
        }

        // 2. Check Expiration date
        if (new Date() > new Date(activeSession.expiresAt)) {
            console.warn("Direct DB Check Failed: Found matching session record but it has expired.");
            return res.status(401).json({ error: "Unauthorized - Token Expired" });
        }

        // 3. FIX: Handle both String IDs and ObjectId types safely for MongoDB
        const targetUserId = activeSession.userId;
        let activeUser = await db.collection("user").findOne({ id: targetUserId });

        if (!activeUser) {
            activeUser = await db.collection("user").findOne({ _id: targetUserId as any });
        }

        if (!activeUser && mongoose.Types.ObjectId.isValid(targetUserId)) {
            activeUser = await db.collection("user").findOne({ _id: new mongoose.Types.ObjectId(targetUserId) });
        }

        if (!activeUser) {
            console.warn("Direct DB Check Failed: Session row is valid but linked user record is missing for UID:", targetUserId);
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 4. Populate request object safely
        (req as any).user = {
            id: activeUser.id || String(activeUser._id),
            email: activeUser.email,
        };

        return next();

    } catch (error) {
        console.error("Direct Database Authentication System Exception:", error);
        return res.status(500).json({ error: "Internal Authentication Failed" });
    }
};
