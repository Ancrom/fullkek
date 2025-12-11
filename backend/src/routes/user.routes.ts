import { Router } from "express";
import { getUsers, getUserById } from "../controllers/user.controller.ts";

const router = Router();

// GET /users - получить список пользователей
router.get("/", getUsers);

// GET /users/:id - получить пользователя по ID
router.get("/:id", getUserById);

export default router;