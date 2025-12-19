import express, { Router } from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllUser, getMessages, sendMessage } from "../controllers/message.controller.js";
import upload from "../middleware/multer.middleware.js";


const messageRoute = express.Router()

messageRoute.get("/users", protectedRoute,getAllUser)
messageRoute.get("/:id",protectedRoute, getMessages)
messageRoute.post("/send/:id",protectedRoute,upload.single("image"),sendMessage);

export default messageRoute;