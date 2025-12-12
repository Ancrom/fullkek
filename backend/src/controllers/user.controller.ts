import type { Request, Response } from "express";

import { userRepository } from "../modules";
import { userService } from "../services/user.serviсe";

const userServiceIns = new userService(userRepository);

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(userRepository.getAllUsers());
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = userServiceIns.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const createUser = (req: Request, res: Response) => {
  const user = req.body;

  try {
    const createdUser = userServiceIns.createUser(user);
    return res.status(201).json(createdUser);
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.body;

  try {
    const updatedUser = userServiceIns.updateUser(id, user);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    userServiceIns.deleteUser(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
