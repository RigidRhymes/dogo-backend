import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { connectToDatabase } from "@/database/mongoose";

// Use ReturnType to get the EXACT type created by betterAuth
// We don't initialize it with a type like "Auth"
let authInstance: ReturnType<typeof betterAuth> | undefined;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    // Do NOT add <BetterAuthOptions> here.
    // Let the function infer the schema from your object.
    const instance = betterAuth({
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
    });

    authInstance = instance;
    return authInstance;
};

// This is what you'll use if you need the type elsewhere
export type Auth = ReturnType<typeof betterAuth>;
