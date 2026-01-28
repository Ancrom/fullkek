import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: () => void) {
	const token = req.cookies.access_token;
	if (!req.body || !token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!);
		req.body = payload;
		next();
	} catch (e) {
		return res.status(401).json({ message: "Unauthorized" });
	}
}