/* @ts-nocheck */
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { connectToDatabase } from "../../database/mongoose";
let authInstance;
export const getAuth = async () => {
    if (authInstance)
        return authInstance;
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db)
        throw new Error("Database not connected");
    // @ts-ignore - pre-existing better-auth type compatibility issue
    authInstance = betterAuth({
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET, // must be at least 32 chars
        baseURL: process.env.BETTER_AUTH_URL, // e.g. https://dogotracker.vercel.app
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()] // handles cookies automatically
    });
    return authInstance;
};
