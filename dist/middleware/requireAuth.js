"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const auth_1 = require("../lib/better-auth/auth");
// 1. Import the native header conversion utility from the node bundle
const node_1 = require("better-auth/node");
const requireAuth = async (req, res, next) => {
    const auth = await (0, auth_1.getAuth)();
    if (!auth) {
        return res.status(500).json({ error: "Auth instance not found" });
    }
    try {
        // 2. Pass headers directly at the root of the input argument payload
        const session = await auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers) // ✅ Correctly handled by the Better Auth parser
        });
        if (!session?.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Bind the validated user profile data to the pipeline context
        req.user = session.user;
        return next();
    }
    catch (error) {
        console.error("Auth middleware exception:", error);
        return res.status(500).json({ error: "Internal Authentication Error" });
    }
};
exports.requireAuth = requireAuth;
