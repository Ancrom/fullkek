export interface IUser {
  id: string;

  email: string;
  username: string;

  emailConfirmed: boolean;
  createdAt: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt: string | null;

  password: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  description: string | null;
  birthday: string | null;
  phone: string | null;
}

export interface IUserDto {
  email: string;
  username: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  description: string | null;
  birthday: string | null;
  phone: string | null;
}

export interface IUserRes{
  data: IUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
