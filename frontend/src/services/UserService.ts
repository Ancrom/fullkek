import type { IUser, IUserDto } from "../types/UserType";
import { usersApi } from "../api/usersApi";

function formatDate(date: string): string {
	if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function transformUser(user: IUser): IUser {
  return {
    ...user,
    createdAt: formatDate(user.createdAt),
    lastLoginAt: user.lastLoginAt ? formatDate(user.lastLoginAt) : null,
    birthday: user.birthday ? formatDate(user.birthday) : null,
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
