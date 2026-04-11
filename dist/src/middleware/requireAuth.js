"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const auth_1 = require("@/lib/better-auth/auth");
async function requireAuth(req, res, next) {
    try {
        const auth = await (0, auth_1.getAuth)();
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === "string") {
                headers.append(key, value);
            }
            else if (Array.isArray(value)) {
                for (const v of value)
                    headers.append(key, v);
            }
        }
        const session = await auth.api.getSession({ headers });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
        };
        return next();
    }
    catch (err) {
        console.error("Auth check failed: ", err);
        return res.status(500).json({ error: "Server error during auth" });
    }
}
