import { Request, Response, NextFunction } from "express";
import { getAuth } from "@/lib/better-auth/auth";
// 1. Import the native header conversion utility from the node bundle
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = await getAuth();

    if (!auth) {
        return res.status(500).json({ error: "Auth instance not found" });
    }

    try {
        // 2. Pass headers directly at the root of the input argument payload
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers) // ✅ Correctly handled by the Better Auth parser
        });

        if (!session?.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Bind the validated user profile data to the pipeline context
        (req as any).user = session.user;
        return next();

    } catch (error) {
        console.error("Auth middleware exception:", error);
        return res.status(500).json({ error: "Internal Authentication Error" });
    }
};
