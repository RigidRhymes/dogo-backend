import { Request, Response, NextFunction } from "express";
import { getAuth } from "lib/better-auth/auth";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = await getAuth();

    // Convert IncomingHttpHeaders → Headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
            headers.append(key, Array.isArray(value) ? value.join(",") : String(value));
        }
    }

    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    (req as any).user = session.user;
    next();
};
