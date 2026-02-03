import { pool } from "../db";
import type { ISession } from "../types/auth.types";

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

  async createSession(session: ISession) {
    await pool.query(
      "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [session.id, session.userId, session.tokenHash, session.expiresAt],
    );
  }

  async updateSession(
    session: Pick<ISession, "id" | "tokenHash" | "expiresAt">,
  ) {
    await pool.query(
      "UPDATE sessions SET token_hash = $1, expires_at = $2 WHERE id = $3",
      [session.tokenHash, session.expiresAt, session.id],
    );
  }

	async deleteSessionById(id: string) {
		await pool.query("DELETE FROM sessions WHERE id = $1", [id]);
	}

  async deleteSessionByUserId(id: string) {
    await pool.query("DELETE FROM sessions WHERE user_id = $1", [id]);
  }

  async getSessionByUserId(id: string) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE user_id = $1",
      [id],
    );
    return rows[0];
  }
}

export const authRepository = new AuthRepository();
