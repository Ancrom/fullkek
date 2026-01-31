import { pool } from "../db";

export class AuthRepository {
  async getUserByEmail(email: string) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  }
  async getUserById(id: string) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }
}

export const authRepository = new AuthRepository();
