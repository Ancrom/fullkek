export interface IUser {
  id: string;

  email: string;
  username: string;

  emailConfirmed: boolean;
  createdAt: Date;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt: Date | null;
	updatedAt: Date | null;

  password: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  description: string | null;
  birthday: Date | null;
  phone: string | null;
}

export interface IPostUserDto {
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
