import {getAuth} from "../../../lib/better-auth/auth";

export const requireAuth = async (req, res, next) => {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;
    next();
};
