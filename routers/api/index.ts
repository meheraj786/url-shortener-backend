import express, { Request, Response } from "express";
import authRouter from "./auth.router";
import urlRouter from "./url.router";
const apiRouter=express.Router()

apiRouter.use("/auth", authRouter)
apiRouter.use("/url", urlRouter)

export default apiRouter