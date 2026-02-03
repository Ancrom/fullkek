import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// /protected - для теста аутентификации
router.get("/protected", authMiddleware("access_token"), (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully" });
});

// GET /users - получить список пользователей
router.get("/", authMiddleware("access_token"), getUsers);

// GET /users/:id - получить пользователя по ID
router.get("/:id", authMiddleware("access_token"), getUserById);

// POST /users - создать пользователя
router.post("/", createUser);

// PUT /users/:id - обновить пользователя по ID
router.put("/:id", authMiddleware("access_token"), updateUser);
router.put("/", authMiddleware("access_token"), updateUser);

// DELETE /users/:id - удалить пользователя по ID
router.delete("/:id", authMiddleware("access_token"), deleteUser);

export default router;
