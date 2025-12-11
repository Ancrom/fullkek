import { v4 as uuidv4 } from "uuid";

import type { User, UserCreateUpdate } from "../types/user.types.ts";

export class UserRepository {
  users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: UserCreateUpdate): User {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      emailVerified: false,
      createdAt: new Date(),
      lastLoginAt: null,
      isActive: true,
      role: "user",
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, data: UserCreateUpdate): User | undefined {
    const user = this.users.find((user) => user.id === id);
    const index = this.users.findIndex((user) => user.id === id);
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
