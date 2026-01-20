import type { IUser, IUserDto, IUserRes } from "../types/UserType";
import { usersApi } from "../api/usersApi";

export function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
}

export function transformUser(user: IUser): IUser {
  return {
    id: user?.id ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
    emailConfirmed: user?.emailConfirmed ?? false,
    role: user?.role ?? "user",
    isActive: user?.isActive ?? true,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    description: user?.description ?? "",
    phone: user?.phone ?? "",
    password: user?.password ?? "",
    createdAt: formatDate(user?.createdAt),
    lastLoginAt: formatDate(user?.lastLoginAt),
    birthday: formatDate(user?.birthday),
  };
}

export async function fetchUsersService(
  page: number = 1,
  limit: number = 10,
): Promise<IUser[]> {
  const response: IUserRes = await usersApi.fetchUsers(page, limit);
  if (!response?.data || !Array.isArray(response.data)) return [];
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
