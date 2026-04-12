"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const auth_1 = require("@/lib/better-auth/auth");
const requireAuth = async (req, res, next) => {
    const auth = await (0, auth_1.getAuth)();
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
    req.user = session.user;
    next();
};
exports.requireAuth = requireAuth;
