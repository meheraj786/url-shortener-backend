import express from "express";
import { login, logout, me, register } from "../../controller/auth.controller";
const authRouter=express.Router()

authRouter.use("/register", register)
authRouter.use("/login", login)
authRouter.use("/logout", logout)
authRouter.use("/me", me)

export default authRouter