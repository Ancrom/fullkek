import { AuthRepository } from "../modules/auth.repository";
import { UnauthorizedError, ForbiddenError } from "../errors/HttpError";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import type { IUser } from "../types/user.types";
import type { IJWTPayload } from "../types/auth.types";

export class AuthService {
  constructor(private repo: AuthRepository) {
    this.repo = repo;
  }

  private makeResponse(
    user: Pick<IUser, "id" | "email" | "username" | "role">,
  ) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  private makeTokens(payload: IJWTPayload) {
    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    return {
      accessToken: jwt.sign({ ...payload }, ACCESS_SECRET as string, {
        expiresIn: "15m",
      }),
      refreshToken: jwt.sign({ ...payload }, REFRESH_SECRET as string, {
        expiresIn: "7d",
      }),
    };
  }

  private async getUserByEmail(email: string): Promise<IUser> {
    const user: IUser = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    return user;
  }

  async login(dto: { email: string; password: string }) {
    if (!dto.email || !dto.password) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const user = await this.getUserByEmail(dto.email);
    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokens = this.makeTokens({ sub: user.id, role: user.role });
    const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней;
    await this.repo.createSession({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: await argon2.hash(tokens.refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    return {
      ...tokens,
      userData: this.makeResponse(user),
    };
  }

  async checkSession(token: string) {
    if (!token) {
      throw new UnauthorizedError("No access token");
    }
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
      ) as IJWTPayload;
      const user = await this.repo.getUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      return this.makeResponse({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } catch (e) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedError("No refresh token");

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      sub: string;
      role: IUser["role"];
    };

    const session = await this.repo.getSessionByUserId(payload.sub);
    if (!session) {
      throw new ForbiddenError("Session not found");
    }

    const isValid = await argon2.verify(session.token_hash, refreshToken);
    const isExpired = new Date() > new Date(session.expires_at);

    if (!isValid || isExpired) {
      await this.repo.deleteSessionById(session.id);
      throw new ForbiddenError("Invalid or expired session");
    }

    const tokens = this.makeTokens({ sub: payload.sub, role: payload.role });

    const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
    await this.repo.updateSession({
      id: session.id,
      tokenHash: await argon2.hash(tokens.refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as {
        sub: string;
      };

      await this.repo.deleteSessionByUserId(payload.sub);
    } catch (e) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}
