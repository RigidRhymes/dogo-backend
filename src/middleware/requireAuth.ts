import { Request, Response, NextFunction } from 'express'
import mongoose from "mongoose"

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("requireAuth blocked: Missing of invalid authorization header prefix.")
            return res.status(401).json({error: "Unauthorized"});
        }
            const parts = authHeader.split(" ");
            const tokenValue = parts[1];

            if(!tokenValue || tokenValue === "undefined"){
                console.warn("requireAuth blocked: Forwarded token string is empty or undefined.")
                return res.status(401).json({ error: "Unauthorized" });
            }

            const db = mongoose.connection.db;

            if (!db){
                console.error("requireAuth blocked: Database connection socket is unavailable")
                return res.status(500).json({ error: "Internal Authentication system failure" });
            }

            const activeSession = await db.collection("session").findOne({ token: tokenValue });

            if(!activeSession){
                console.warn("Direct DB check Failed: Token not found inside session collection table", tokenValue)
                return res.status(401).json({ error: "Unauthorized Active Session" });
            }

            if(new Date() > new Date(activeSession.expiresAt)) {
                console.warn("Direct DB Check Failed: Found matching session record but it has expired.")
                return res.status(401).json({ error: "Unauthorized - Token Expired" });
            }

            const activeUser = await db.collection("user").findOne({ _id: activeSession.userId });

            if(!activeUser){
                console.warn("Direct DB Check Failed: Session row is valid but linked user record is missing")
                return res.status(401).json({ error: "Unauthorized"})
            }

            (req as any).user = {
                id: String(activeUser._id),
                email: activeUser.email,
            }

            return next()

    }catch (error){
        console.error("Direct Database Authentication System Exception:", error)
        return res.status(500).json({ error: "Internal Authentication Failed" });
    }
}