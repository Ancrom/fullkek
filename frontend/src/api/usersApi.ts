import type { IUser, IUserDto } from "../types/UserType";
import { api } from "./api";

export const usersApi = {
  fetchUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: IUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    return api.get(`/users?page=${page}&limit=${limit}`).then((r) => r.data);
  },

  fetchById: async (id: string): Promise<IUser> =>
    api.get(`/users/${id}`).then((r) => r.data),

  create: async (dto: IUserDto): Promise<IUser> =>
    api.post<IUser>("/users", dto).then((r) => r.data),

  update: async (id: string, dto: IUserDto): Promise<IUser> =>
    api.put<IUser>(`/users/${id}`, dto).then((r) => r.data),
};
