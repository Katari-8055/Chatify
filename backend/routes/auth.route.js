import express from "express"
import { login, logout, profileUpdate, signUp } from "../controllers/auth.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);
router.post("/profileUpdate", upload.single("profileImage") ,profileUpdate)

export default router;