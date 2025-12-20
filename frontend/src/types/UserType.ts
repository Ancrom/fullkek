export interface IUser {
  id: string;

  email: string;
  username: string;

  emailVerified: boolean;
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
  phoneNumber: string | null;
}
