import type { IUser } from "../types/user.types";
import { pool } from "../db";

export class UserRepository {
  async getAllUsers(): Promise<IUser[]> {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  }

  async getUserById(id: string): Promise<IUser> {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<IUser> {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  }

  async createUser(user: IUser): Promise<IUser> {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, username, password, "firstName", "lastName", "avatarUrl", description, birthday, "phoneNumber", role, "isActive", "emailVerified", "lastLoginAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        user.id,
        user.email,
        user.username,
        user.password,
        user.firstName,
        user.lastName,
        user.avatarUrl,
        user.description,
        user.birthday,
        user.phoneNumber,
        user.role,
        user.isActive,
        user.emailVerified,
        user.lastLoginAt,
        user.createdAt,
      ]
    );
    return rows[0];
  }

  async updateUser(id: string, user: IUser): Promise<IUser> {
    const { rows } = await pool.query(
      `UPDATE users SET email = $1, username = $2, "firstName" = $3, "lastName" = $4, "avatarUrl" = $5, description = $6, birthday = $7, "phoneNumber" = $8, role = $9, "isActive" = $10, "emailVerified" = $11, "lastLoginAt" = $12, "createdAt" = $13
			WHERE id = $14 RETURNING *`,
      [
        user.email,
        user.username,
        user.firstName,
        user.lastName,
        user.avatarUrl,
        user.description,
        user.birthday,
        user.phoneNumber,
        user.role,
        user.isActive,
        user.emailVerified,
        user.lastLoginAt,
        user.createdAt,
        id,
      ]
    );
    return rows[0];
  }

  async deleteUser(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}

export const userRepository = new UserRepository();
