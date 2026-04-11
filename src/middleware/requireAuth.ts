import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch"; // or global fetch if Node 18+

type Session = {
    user: {
        id: string;
        email?: string;
    };
};

type RequestWithUser = Request & {
    user?: { id: string; email?: string };
};

export async function requireAuth(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const response = await fetch(`${process.env.BETTERAUTH_URL}/api/session`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Explicitly cast the JSON result to Session
        const session: Session = await response.json() as Session;

        req.user = {
            id: session.user.id,
            email: session.user.email,
        };

        return next();
    } catch (err) {
        console.error("Auth check failed:", err);
        return res.status(500).json({ error: "Server error during auth" });
    }
}
