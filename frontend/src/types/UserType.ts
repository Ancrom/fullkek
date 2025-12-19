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

