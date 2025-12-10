export interface User {
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

