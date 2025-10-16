import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware";
import { createShortUrl, getUserUrls } from "../../controller/url.controller";
const urlRouter = express.Router();

urlRouter.post("/shorten", optionalAuth, createShortUrl);
urlRouter.get("/user/links", requireAuth, getUserUrls);

export default urlRouter;
