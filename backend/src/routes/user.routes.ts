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
router.get("/users", getUsers);

// GET /users/:id - получить пользователя по ID
router.get("/users/:id", getUserById);

// POST /users - создать пользователя
router.post("/users", createUser);

// PUT /users/:id - обновить пользователя по ID
router.put("/users/:id", updateUser);
router.put("/users/", updateUser);

// DELETE /users/:id - удалить пользователя по ID
router.delete("/users/:id", deleteUser);

export default router;
