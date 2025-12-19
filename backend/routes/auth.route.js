import express from "express"
import { checkAuth, login, logout, profileUpdate, signUp } from "../controllers/auth.controller.js";
import upload from "../middleware/multer.middleware.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);
router.patch("/profileUpdate", protectedRoute ,upload.single("profileImage") ,profileUpdate)
router.get("/checkAuth", protectedRoute,checkAuth)

export default router;