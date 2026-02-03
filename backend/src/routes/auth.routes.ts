import { Router } from "express";
import {
  login,
  logout,
  checkSession,
  refresh,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// POST /auth/login - Аутентификация пользователя и создание сессии
router.post("/login", login);

// POST /auth/refresh - Обновление access-токена
router.post("/refresh", authMiddleware("refresh_token"), refresh);

// POST /auth/logout - Завершение сессии
router.post("/logout", logout);

// GET /auth/me - Проверка сессии
router.get("/me", checkSession);

export default router;
