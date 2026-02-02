import { AuthRepository } from "../modules/auth.repository";
import { UnauthorizedError, ForbiddenError } from "../errors/HttpError";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import type { IUser, IJWTPayload } from "../types/user.types";

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

  private makeToken(payload: IJWTPayload) {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "1d" });
  }

  private async getUserByEmail(email: string): Promise<IUser> {
    const user: IUser = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    return user;
  }

  async login(dto: { email: string; password: string }) {
    if (!dto || !dto.email || !dto.password) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const user = await this.getUserByEmail(dto.email);
    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.makeToken({ sub: user.id, role: user.role });
    return {
      token,
      user: this.makeResponse(user),
    };
  }

  async checkSession(token: string) {
    if (!token) {
      throw new UnauthorizedError("No access token");
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await this.repo.getUserById((payload as any).sub);
			if (!user) {
				throw new UnauthorizedError("User not found");
			}
      return this.makeResponse({
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role,
			});
<<<<<<< HEAD
    } catch (e) {
<<<<<<< HEAD
			console.log(e)
=======
      const user = await this.repo.getUserById(payload.sub as string);
      return this.makeResponse(user);
    } catch (e) {
>>>>>>> b64ec4c (issue #39: Добавить Auth API; issue #42: Добавить хэширование и верификацию паролей)
=======
    } catch (e) {
			console.log(e)
>>>>>>> 7d88b78 (Issue #39: Добавлены тесты, переработал сервис auth.service)
=======
>>>>>>> dee61d8 (issue #44: Добавить защиту маршрутов)
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async refresh(token: string) {
    if (!token) throw new UnauthorizedError("No access token");

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      role: IUser["role"];
    };

    return this.makeToken(payload);
  }
}
