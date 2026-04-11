import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as process from "node:process";

type RequestWithUser = Request & { user?: { id: string; email?: string } };

export function requireAuth(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email?: string };
        req.user = { id: decoded.id, email: decoded.email };
        next();

        console.log("Local JWT_SECRET:", process.env.JWT_SECRET)
    } catch (err) {
        console.error("Auth check failed:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
}
