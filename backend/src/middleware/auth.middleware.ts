import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { handleError } from "../controllers/handleError";

export function authMiddleware(req: Request, res: Response, next: () => void) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({
      code: "UNAUTHORIZED_ERROR",
      message: "Unauthorized",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      code: "UNAUTHORIZED_ERROR",
      message: "Unauthorized",
    });
  }
}
