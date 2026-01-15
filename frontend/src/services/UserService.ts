import type { IUser, IUserDto } from "../types/UserType";
import { usersApi } from "../api/usersApi";

function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function transformUser(user: IUser): IUser {
  return {
    id: user.id ?? "",
    email: user.email ?? "",
    username: user.username ?? "",
    emailConfirmed: user.emailConfirmed ?? false,
    role: user.role ?? "user",
    isActive: user.isActive ?? true,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    avatarUrl: user.avatarUrl ?? "",
    description: user.description ?? "",
    phone: user.phone ?? "",
    password: user.password ?? "",
    createdAt: formatDate(user.createdAt),
    lastLoginAt: user.lastLoginAt ? formatDate(user.lastLoginAt) : "",
    birthday: user.birthday ? formatDate(user.birthday) : "",
  };
}

export async function fetchUsersService(
  page: number = 1,
  limit: number = 10
): Promise<IUser[]> {
  const response: { data: IUser[] } = await usersApi.fetchUsers(page, limit);
  return response.data.map(transformUser);
}

export async function fetchUserByIdService(id: string): Promise<IUser> {
  const response = await usersApi.fetchById(id);
  return transformUser(response);
}

export async function createUserService(dto: IUserDto): Promise<IUser> {
  const response = await usersApi.create(dto);
  return transformUser(response);
}
