import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "../routes/auth.route.js"
import errorHandler from "../middleware/error.middleware.js"
import messageRoute from "../routes/message.route.js"
import morgan from "morgan"


dotenv.config()

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: '16kb'})); 
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public")); 
app.use(cookieParser()); 

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(morgan("dev"));

app.use("/api/v1/user", router);
app.use("/api/v1/message", messageRoute);
app.use(errorHandler);

export default app