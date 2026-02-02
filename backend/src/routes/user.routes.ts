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
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully" });
});

// GET /users - получить список пользователей
router.get("/", authMiddleware, getUsers);

// GET /users/:id - получить пользователя по ID
router.get("/:id", authMiddleware, getUserById);

// POST /users - создать пользователя
router.post("/", authMiddleware, createUser);

// PUT /users/:id - обновить пользователя по ID
router.put("/:id", authMiddleware, updateUser);
router.put("/", authMiddleware, updateUser);

// DELETE /users/:id - удалить пользователя по ID
router.delete("/:id", authMiddleware, deleteUser);

export default router;
