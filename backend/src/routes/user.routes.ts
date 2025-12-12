import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// GET /users - получить список пользователей
router.get("/", getUsers);

// GET /users/:id - получить пользователя по ID
router.get("/:id", getUserById);

// POST /users - создать пользователя
router.post("/", createUser);

// PUT /users/:id - обновить пользователя по ID
router.put("/:id", updateUser);

// DELETE /users/:id - удалить пользователя по ID
router.delete("/:id", deleteUser);

export default router;
