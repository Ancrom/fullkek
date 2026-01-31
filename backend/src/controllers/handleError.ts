import { Response } from "express";
import { HttpError } from "../errors/HttpError";

export function handleError(res: Response, e: unknown) {
	if (e instanceof HttpError) {
		res.status(e.status).json({
			code: e.code,
			message: e.message,
		});
		return;
	}

	return res.status(500).json({
		code: "INTERNAL_ERROR",
		message: "Internal server error",
	});
}