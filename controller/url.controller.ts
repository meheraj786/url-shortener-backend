import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Url from "../models/url.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createShortUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { longUrl } = req.body as { longUrl?: string };
    if (!longUrl)
      return res.status(400).json({ message: "longUrl is required" });

    let shortId = nanoid(6);
    let exists = await Url.findOne({ shortId });
    let attempts = 0;
    while (exists && attempts < 5) {
      shortId = nanoid(6);
      exists = await Url.findOne({ shortId });
      attempts++;
    }
    if (exists)
      return res
        .status(500)
        .json({ message: "Could not generate unique short id" });

    const owner = req.userId ? req.userId : null;
    const urlDoc = await Url.create({ longUrl, shortId, owner });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shortUrl = `${baseUrl}/${shortId}`;

    return res.status(201).json({ shortUrl, id: urlDoc._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params as { shortId: string };
    if (!shortId) return res.status(400).json({ message: "shortId required" });

    const urlDoc = await Url.findOne({ shortId });
    if (!urlDoc) return res.status(404).json({ message: "URL not found" });

    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    await urlDoc.save();

    return res.redirect(urlDoc.longUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserUrls = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const urls = await Url.find({ owner: userId }).sort({ createdAt: -1 });
    return res.json({ urls });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
