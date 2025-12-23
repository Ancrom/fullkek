import type { IUser } from "../types/UserType";
import { fetchUsers } from "../api/usersApi";

function formatDate(date: string): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function transformUser(user: IUser): IUser {
  return {
    ...user,
    createdAt: formatDate(user.createdAt),
    lastLoginAt: user.lastLoginAt ? formatDate(user.lastLoginAt) : null,
    birthday: user.birthday ? formatDate(user.birthday) : null,
  };
}

export async function fetchUsersService(): Promise<IUser[]> {
  const response = await fetchUsers();
  return response.data.map(transformUser);
}
