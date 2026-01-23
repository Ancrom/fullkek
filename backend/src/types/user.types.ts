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

export interface IUserRow {
	id: string;
	email: string;
	username: string;
	email_confirmed: boolean;
	created_at: Date;
	role: "user" | "admin" | "moderator";
	is_active: boolean;
	last_login_at: Date | null;
	updated_at: Date | null;
	password: string;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
	description: string | null;
	birthday: Date | null;
	phone: string | null;
}
