import { Request, Response, NextFunction } from "express";
import { getAuth } from '@/lib/better-auth/auth';
import { fromNodeHeaders } from "better-auth/node";


export const requireAuth = async ( req: Request, res: Response, next: NextFunction) => {
    const auth = await getAuth();

    if(!auth) return res.status(500).json({ error: "Auth instance not found"})

    try {
        let headers = fromNodeHeaders(req.headers);

        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer")){
            const token = authHeader.split(" ")[1];

            const manualHeaders = new Headers();
            manualHeaders.append("Cookie", `better-auth.session_token=${token}`);
            headers = manualHeaders;
        }

        const session = await auth.api.getSession({ headers })

        if(!session?.user) return res.status(401).json({ error: "Unauthorized" });

        (req as any).user = {
            id: session.user.id,
            email: session.user.email,
        }

        return next();

    }catch (error){
        console.error("Auth middleware error: ", error);
        return res.status(500).json({ error: "Internal Authentication Error" });
    }
}