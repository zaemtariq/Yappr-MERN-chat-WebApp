import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
       
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Found" })
        }
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal Server Error!" });

    }
}