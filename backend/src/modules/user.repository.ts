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
    const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [
      email,
    ]);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<IUser> {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE LOWER(username) = $1",
      [username]
    );
    return rows[0];
  }

  async createUser(user: IUser): Promise<IUser> {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, username, password, first_name, last_name, avatar_url, description, birthday, phone, role, is_active, email_confirmed, last_login_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        user.id,
        user.email,
        user.username,
        user.password,
        user.first_name,
        user.last_name,
        user.avatar_url,
        user.description,
        user.birthday,
        user.phone,
        user.role,
        user.is_active,
        user.email_confirmed,
        user.last_login_at,
        user.created_at,
      ]
    );
    return rows[0];
  }

  async updateUser(id: string, user: IUser): Promise<IUser> {
    const { rows } = await pool.query(
      `UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, avatar_url = $5, description = $6, birthday = $7, phone = $8, role = $9, is_active = $10, email_confirmed = $11, last_login_at = $12, created_at = $13
			WHERE id = $14 RETURNING *`,
      [
        user.email,
        user.username,
        user.first_name,
        user.last_name,
        user.avatar_url,
        user.description,
        user.birthday,
        user.phone,
        user.role,
        user.is_active,
        user.email_confirmed,
        user.last_login_at,
        user.created_at,
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
