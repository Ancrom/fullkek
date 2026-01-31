import type { IUser, IUserRow } from "../types/user.types";
import { pool } from "../db";
import { userMapper } from "../mappers/userMapper";

export class UserRepository {
  async getAllUsers(): Promise<IUser[]> {
    const { rows } = await pool.query<IUserRow>("SELECT * FROM users");
    return rows.map(userMapper);
  }

  async getPage(offset: number, limit: number): Promise<IUser[]> {
    const { rows } = await pool.query<IUserRow>(
      "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return rows.map(userMapper);
  }

  async getCount(): Promise<number> {
    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*) FROM users",
    );
    return parseInt(rows[0].count);
  }

  async getUserById(id: string): Promise<IUser> {
    const { rows } = await pool.query<IUserRow>(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );
    return userMapper(rows[0]);
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const { rows } = await pool.query<IUserRow>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return userMapper(rows[0]);
  }

  async getUserByUsername(username: string): Promise<IUser> {
    const { rows } = await pool.query<IUserRow>(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    return userMapper(rows[0]);
  }

  async createUser(user: IUser): Promise<IUser> {
    const { rows } = await pool.query<IUserRow>(
      `INSERT INTO users (
      		id,
      		email,
      		username,
      		password,
      		first_name,
      		last_name,
      		avatar_url,
      		description,
      		birthday,
      		phone,
      		role,
      		is_active,
      		email_confirmed,
      		last_login_at,
      		created_at,
      		updated_at
    		)
    		VALUES (
      		$1,  $2,  $3,  $4,  $5,  $6,  $7,  $8,
      		$9,  $10, $11, $12, $13, $14, $15, $16
    		)
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
        user.phone,
        user.role,
        user.isActive,
        user.emailConfirmed,
        user.lastLoginAt,
        user.createdAt,
        user.updatedAt,
      ],
    );
    return userMapper(rows[0]);
  }

  async updateUser(id: string, user: IUser): Promise<IUser> {
    const { rows } = await pool.query<IUserRow>(
      `UPDATE users
    		SET email = $1,
         username = $2,
         password = $3,
         first_name = $4,
         last_name = $5,
         avatar_url = $6,
         description = $7,
         birthday = $8,
         phone = $9,
         role = $10,
         is_active = $11,
         email_confirmed = $12,
         last_login_at = $13,
         created_at = $14,
         updated_at = $15
     		WHERE id = $16
     		RETURNING *`,
      [
        user.email,
        user.username,
        user.password,
        user.firstName,
        user.lastName,
        user.avatarUrl,
        user.description,
        user.birthday,
        user.phone,
        user.role,
        user.isActive,
        user.emailConfirmed,
        user.lastLoginAt,
        user.createdAt,
        user.updatedAt,
        id,
      ],
    );

    return userMapper(rows[0]);
  }

  async deleteUser(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}

export const userRepository = new UserRepository();
