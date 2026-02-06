import type {
  IUser,
  IUserDto,
  IUserResLogin,
  IUserRes,
} from "../types/UserType";
import { api } from "./api";

export const usersApi = {
  fetchUsers: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<IUserRes> => {
    return api.get(`/users?page=${page}&limit=${limit}`).then((r) => r.data);
  },

  fetchById: async (id: string): Promise<IUser> =>
    api.get(`/users/${id}`).then((r) => r.data),

  create: async (dto: IUserDto): Promise<IUser> =>
    api.post<IUser>("/users", dto).then((r) => r.data),

  update: async (id: string, dto: IUserDto): Promise<IUser> =>
    api.put<IUser>(`/users/${id}`, dto).then((r) => r.data),

  login: async (dto: {
    email: string;
    password: string;
  }): Promise<IUserResLogin> =>
    api.post<IUser>("/auth/login", dto).then((r) => r.data),
};
