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
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  description?: string;
  birthday?: Date;
  phoneNumber?: string;
}

type readOnlyProps =
  | "id"
  | "emailVerified"
  | "role"
  | "createdAt"
  | "lastLoginAt"
  | "isActive";

export type UserDto = Omit<IUser, readOnlyProps>;
