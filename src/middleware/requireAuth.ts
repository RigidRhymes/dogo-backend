import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let tokenValue: string | null = null;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            tokenValue = authHeader.split(" ")[1];
        }

        if (!tokenValue && req.cookies) {
            const cookies = req.cookies as Record<string, unknown>;
            const cookieVal = cookies["better-auth.session_token"];
            tokenValue = typeof cookieVal === "string" ? cookieVal : null;
        }


        console.log("[requireAuth] Authorization header:", authHeader);
        console.log("[requireAuth] Incoming cookies:", req.cookies);
        console.log("[requireAuth] tokenValue:", tokenValue);

        if (!tokenValue) {
            return res.status(401).json({ error: "Unauthorized - No token provider " });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return res.status(500).json({ error: "Internal Authentication system failure" });
        }

        const activeSession = await db.collection("session").findOne({ id: tokenValue })
            || await db.collection("session").findOne({ _id: tokenValue as any });

        if (!activeSession) {
            return res.status(401).json({ error: "Unauthorized - Session not found" });
        }

        const targetUserId = (activeSession as unknown as { userId?: unknown }).userId as unknown;
        const activeUser = await db.collection("user").findOne({ id: targetUserId as unknown })
            || await db.collection("user").findOne({ _id: targetUserId as unknown });



        if (!activeUser) {
            return res.status(401).json({ error: "Unauthorized - User not found" });
        }

        (req as unknown as { user?: { id: string; email?: string } }).user = {
            id: (activeUser as { id?: string; _id?: unknown }).id || String((activeUser as { _id?: unknown })._id),
            email: (activeUser as { email?: string }).email
        };


        return next();
    } catch (error) {
        console.error("Authorization system exception: ", error);
        return res.status(500).json({ error: "Internal Authentication " });
    }
};

