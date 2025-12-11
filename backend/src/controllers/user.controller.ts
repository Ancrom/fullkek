import type { Request, Response } from "express";

import { userRepository } from "../modules/index.ts";

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(userRepository.getAllUsers());
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "ID is required" });
    return;
  }
  const user = userRepository.getUserById(id);
  res.status(200).json(user);
};

export const createUser = (req: Request, res: Response) => {
  const user = req.body;
  const createdUser = userRepository.createUser(user);
  res.status(201).json(createdUser);
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "ID is required" });
    return;
  }
  const user = req.body;
  const updatedUser = userRepository.updateUser(id, user);
  res.status(200).json(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "ID is required" });
    return;
  }
  userRepository.deleteUser(id);
  res.status(204).send();
};
