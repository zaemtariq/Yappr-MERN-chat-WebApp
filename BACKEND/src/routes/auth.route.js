import { Router } from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const route = Router();

route.post("/signup", signup)
route.post("/login", login)
route.post("/logout", logout)
route.put("/profile-update", protectedRoute, updateProfile)
route.get("/check", protectedRoute, checkAuth)

export default route;