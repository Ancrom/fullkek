import type { IUser, UpdateUserDto } from "../types/user.types";
export class UserRepository {
  private users: IUser[] = [];

  getAllUsers(): IUser[] {
    return [...this.users];
  }

  getUserById(id: string): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmailOrUsername(email: string, username: string): IUser | undefined {
    return this.users.find(
      (user) => user.email === email || user.username === username
    );
  }

  createUser(user: IUser): IUser {
    this.users.push(user);
    return user;
  }

  updateUser(id: string, data: UpdateUserDto): IUser {
    const index = this.users.findIndex((user) => user.id === id);
    const user = this.users[index];
    this.users[index] = { ...user, ...data };
    return this.users[index];
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export const userRepository = new UserRepository();
