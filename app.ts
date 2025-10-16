import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import connectDB from "./db.config/dbConnect";
import router from "./routers";
import { redirectUrl } from "./controller/url.controller";

const app = express();

connectDB();

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(router);
app.get("/:shortId", redirectUrl);

export default app;
