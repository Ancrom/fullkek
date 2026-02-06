import type { Request, Response } from "express";
import { handleError } from "./handleError";
import { AuthService } from "../services/auth.service";
import { authRepository } from "../modules/auth.repository";
import cookieUtils from "../utils/cookie/cookie.utils";

const authServiceIns = new AuthService(authRepository);

export const login = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const { accessToken, refreshToken, userData } =
      await authServiceIns.login(user);
    cookieUtils.makeAuthCookies(res, { accessToken, refreshToken });
    return res.status(200).json(userData);
  } catch (e) {
    return handleError(res, e);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authServiceIns.refresh(
      req.cookies.refresh_token,
    );
    cookieUtils.makeAuthCookies(res, { accessToken, refreshToken });
    return res.status(200).json({ status: "refreshed" });
  } catch (e) {
    return handleError(res, e);
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (token) {
    await authServiceIns.logout(token);
  }
  cookieUtils.clearAuthCookies(res);
  return res.sendStatus(204);
};

export const checkSession = async (req: Request, res: Response) => {
  try {
    const payload = await authServiceIns.checkSession(req.cookies.access_token);
    return res.status(200).json(payload);
  } catch (e) {
    return handleError(res, e);
  }
};
