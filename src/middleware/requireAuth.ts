import {getAuth} from "lib/better-auth/auth";
import { Request, Response, NextFunction } from "express";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    (req as any).user = session.user;
    next();
};
