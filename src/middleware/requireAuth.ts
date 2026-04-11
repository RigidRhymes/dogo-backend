import { Request, Response, NextFunction } from 'express';
import {getAuth} from "@/lib/better-auth/auth";



type RequestWithUser = Request & {
    user?: {id: string; email?: string }
}

export async function requireAuth(req: RequestWithUser, res:Response, next:NextFunction){
    try {
        const auth = await getAuth()

        const headers = new Headers()

        for (const [key, value] of Object.entries(req.headers)){
            if (typeof value === "string") {
                headers.append(key, value)
            }else if (Array.isArray(value)) {
                for(const v of value ) headers.append(key, v)
            }
        }

        const session = await auth.api.getSession({ headers })

        if (!session) {
            return res.status(401).json({error: "Unauthorized"})
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
        }

        return next()
    }catch (err){
        console.error("Auth check failed: ", err)
        return res.status(500).json({error: "Server error during auth"})
    }
}