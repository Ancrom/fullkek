import type { IUser } from "../types/user.types";

export const userMapper = (raw: any): IUser => ({
	id: raw.id,
	email: raw.email,
	username: raw.username,
	emailConfirmed: raw.email_confirmed,
	createdAt: raw.created_at,
	updatedAt: raw.updated_at,
	role: raw.role,
	isActive: raw.is_active,
	lastLoginAt: raw.last_login_at,
	password: raw.password,
	firstName: raw.first_name,
	lastName: raw.last_name,
	avatarUrl: raw.avatar_url,
	description: raw.description,
	birthday: raw.birthday,
	phone: raw.phone
});