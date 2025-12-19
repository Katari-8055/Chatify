import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
