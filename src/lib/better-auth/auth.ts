import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import {connectToDatabase} from "@/database/mongoose";


let authInstance: Auth<BetterAuthOptions> | undefined

export const getAuth = async (): Promise<Auth<BetterAuthOptions>> => {
    if (authInstance) return authInstance

    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) throw new Error("Database not connected")

    authInstance = betterAuth<BetterAuthOptions>({
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    })

    return authInstance!
}
