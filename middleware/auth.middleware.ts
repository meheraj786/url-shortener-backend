import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  console.error("JWT_SECRET not set in .env");
  process.exit(1);
}

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; iat?: number; exp?: number };
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    return next();
  } catch (err) {
    return next();
  }
};
