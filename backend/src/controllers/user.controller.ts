import type { Request, Response } from "express";

import { userRepository } from "../modules/user.repository";
import { UserService } from "../services/user.serviсe";
import { HttpError } from "../errors/HttpError";

const userServiceIns = new UserService(userRepository);

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(userRepository.getAllUsers());
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = userServiceIns.getUserById(id);
    res.status(200).json(user);
  } catch (e: any) {
    if (e instanceof HttpError) {
      return res.status(e.status).json({
        code: e.code,
        message: e.message,
      });
    }
  }
};

export const createUser = (req: Request, res: Response) => {
  const user = req.body;
  try {
    const createdUser = userServiceIns.createUser(user);
    return res.status(201).json(createdUser);
  } catch (e: any) {
    if (e instanceof HttpError) {
      return res.status(e.status).json({
        code: e.code,
        message: e.message,
      });
    }
  }
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.body;
  try {
    const updatedUser = userServiceIns.updateUser(id, user);
    return res.status(200).json(updatedUser);
  } catch (e: any) {
    if (e instanceof HttpError) {
      return res.status(e.status).json({
        code: e.code,
        message: e.message,
      });
    }
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    userServiceIns.deleteUser(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return res.status(e.status).json({
        code: e.code,
        message: e.message,
      });
    }
  }
};
