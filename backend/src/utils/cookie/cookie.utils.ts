import { Response } from "express";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};

export const makeAuthCookies = (
  res: Response,
  token: { accessToken: string; refreshToken: string },
) => {
  const ACCESS_TOKEN_TTL = 1000 * 60 * 15; // 15 минут;
  const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней;

  res.cookie(`access_token`, token.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_TTL,
    path: "/",
  });

  res.cookie(`refresh_token`, token.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_TTL,
    path: "/api/auth/refresh",
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access_token", {
    ...cookieOptions,
    path: "/",
  });

  res.clearCookie("refresh_token", {
    ...cookieOptions,
    path: "/api/auth/refresh",
  });
};

const cookieUtils = {
  makeAuthCookies,
  clearAuthCookies,
};

export default cookieUtils;
