import type { Request, Response } from "express";

import { users } from "../data/users.ts";

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};
