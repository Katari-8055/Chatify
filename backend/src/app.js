import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "../routes/auth.route.js"
import errorHandler from "../middleware/error.middleware.js"


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


app.use("/api/v1/user", router);
app.use(errorHandler);

export default app