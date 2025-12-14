import { randomUUID } from "crypto";

import type { IUser, UserDto } from "../types/user.types";
export class UserRepository {
  private users: IUser[] = [];

  getAllUsers(): IUser[] {
    return this.users;
  }

  getUserById(id: string): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmailOrUsername(email: string, username: string): IUser | undefined {
    return this.users.find(
      (user) => user.email === email || user.username === username
    );
  }

  createUser(user: UserDto): IUser {
    const newUser: IUser = {
      ...user,
      id: randomUUID(),
      emailVerified: false,
      createdAt: new Date(),
      lastLoginAt: null,
      isActive: true,
      role: "user",
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, data: UserDto): IUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    const user = this.users[index];
    if (user) {
      this.users[index] = { ...user, ...data };
      return this.users[index];
    }
    return undefined;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export const userRepository = new UserRepository();
