import type { IUser } from "../types/UserType";
import { fetchUsers } from "../api/usersApi";

export class UserService {
  transformDate(date: Date | string) {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  transformUsers(users: IUser[]) {
    return users.map((user) => ({
      ...user,
      createdAt: this.transformDate(user.createdAt),
      lastLoginAt: user.lastLoginAt
        ? this.transformDate(user.lastLoginAt)
        : null,
      birthday: user.birthday ? this.transformDate(user.birthday) : null,
    }));
  }

  async fetchUsers() {
    const response = await fetchUsers();
    return this.transformUsers(response.data);
  }
}
