export interface IUser {
  id: string;

  email: string;
  username: string;

  emailVerified: boolean;
  createdAt: Date;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt: Date | null;

  password: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  description: string | null;
  birthday: Date | null;
  phoneNumber: string | null;
}

export type CreateUserDto = {
  email: string;
  username: string;
  password: string;
	
  firstName: string;
  lastName: string;
  avatarUrl: string;
  description: string;
  birthday: Date;
  phoneNumber: string;
};

export type UpdateUserDto = {
  email: string;
  username: string;
  password: string;

  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  description: string | null;
  birthday: Date | null;
  phoneNumber: string | null;
};
