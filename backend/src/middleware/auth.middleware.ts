import { Request, Response } from "express";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (tokenType: "access_token" | "refresh_token") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[tokenType];
    if (!token) {
      return res.status(401).json({
        code: "UNAUTHORIZED_ERROR",
        message: "Unauthorized",
      });
    }

    try {
      const secret =
        tokenType === "access_token"
          ? process.env.JWT_ACCESS_SECRET!
          : process.env.JWT_REFRESH_SECRET!;

      const payload = jwt.verify(token, secret);
      (req as any).user = payload;
      next();
    } catch (e) {
      return res.status(401).json({
        code: "UNAUTHORIZED_ERROR",
        message: "Unauthorized",
      });
    }
  };
};
