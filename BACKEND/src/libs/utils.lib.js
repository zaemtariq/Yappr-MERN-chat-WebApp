import jwt from "jsonwebtoken";

export let generateToken = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set JWT token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Prevents client-side access to the cookie
        sameSite: "strict", // Strict cookie handling to prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    });

    // Return the token for any additional usage if needed
    return token;
};
