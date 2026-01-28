import type { Request, Response } from "express";
import { handleError } from "./handleError";
import { AuthService } from "../services/auth.service";
import { authRepository } from "../modules/auth.repository";

const authServiceIns = new AuthService(authRepository);

export const login = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const { token, user: userData } = await authServiceIns.login(user);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json(userData);
  } catch (e) {
    return handleError(res, e);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    await authServiceIns.refresh(req.cookies.access_token);
    return res.status(200).json({ status: "refreshed" });
  } catch (e) {
    return handleError(res, e);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.sendStatus(204);
  } catch (e) {
    return handleError(res, e);
  }
};

export const checkSession = async (req: Request, res: Response) => {
  try {
    const payload = await authServiceIns.checkSession(req.cookies.access_token);
    return res.status(200).json(payload);
  } catch (e) {
    return handleError(res, e);
  }
};
