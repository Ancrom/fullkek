import type { Request, Response } from "express";

import { userRepository } from "../modules/user.repository";
import { UserService } from "../services/user.service";
import { HttpError } from "../errors/HttpError";

const userServiceIns = new UserService(userRepository);

function handleError(res: Response, e: unknown) {
  if (e instanceof HttpError) {
    res.status(e.status).json({
      code: e.code,
      message: e.message,
    });
    return;
  }

  return res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}

export const getUsers = async (req: Request, res: Response) => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  try {
    res.status(200).json(await userServiceIns.getPage({ page, limit }));
  } catch (e) {
    return handleError(res, e);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await userServiceIns.getUserById(id);
    res.status(200).json(user);
  } catch (e) {
    return handleError(res, e);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const createdUser = await userServiceIns.createUser(user);
    return res.status(201).json(createdUser);
  } catch (e) {
    return handleError(res, e);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.body;
  try {
    const updatedUser = await userServiceIns.updateUser(id, user);
    return res.status(200).json(updatedUser);
  } catch (e) {
    return handleError(res, e);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    userServiceIns.deleteUser(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    return handleError(res, e);
  }
};
