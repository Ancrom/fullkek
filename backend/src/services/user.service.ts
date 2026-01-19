import type { IUser, IPostUserDto } from "../types/user.types";
import { DatabaseError } from "pg";
import { UserRepository } from "../modules/user.repository";
import { errors } from "../errors/HttpError";
import { validators } from "../utils/validators/validators";
import { normalizeString } from "../utils/normalizeString";

export class UserService {
  constructor(private repo: UserRepository) {
    this.repo = repo;
  }

  private validateUser(
    dto: IPostUserDto,
    id?: string,
    mode: "create" | "update" = "create"
  ) {
    const rules = [
      {
        condition: !dto.email || !dto.username || !dto.password,
        error: "email, username and password are required",
      },
      {
        condition: mode === "update" && !id,
        error: "ID is required",
      },
      {
        condition: id && !validators.isUUID(id),
        error: "ID is not valid UUID",
      },
      {
        condition: dto.email && !validators.isEmail(dto.email),
        error: "Email is not valid",
      },
      {
        condition: dto.username && !/^[a-zA-Z0-9_]{3,16}$/.test(dto.username),
        error: "Username must be between 3 and 16 characters",
      },
      {
        condition: dto.password && dto.password.length < 8,
        error: "Password must be at least 8 characters",
      },
      {
        condition: dto.firstName && dto.firstName.length > 20,
        error: "First name must be at most 20 characters",
      },
      {
        condition: dto.lastName && dto.lastName.length > 20,
        error: "Last name must be at most 20 characters",
      },
      {
        condition: dto.avatarUrl && !validators.isURL(dto.avatarUrl),
        error: "Avatar URL is not valid",
      },
      {
        condition: dto.description && dto.description.length > 100,
        error: "Description must be at most 100 characters",
      },
    ];
		for (const rule of rules) {
			if (rule.condition) {
				throw new errors.ValidationError(rule.error);
			}
		}
  }

  private buildUser(dto: IPostUserDto, user?: IUser): IUser {
    return {
      id: user?.id ?? crypto.randomUUID(),

      emailConfirmed: user?.emailConfirmed ?? false,
      createdAt: user?.createdAt ?? new Date(),
      role: user?.role ?? "user",
      isActive: user?.isActive ?? true,
      lastLoginAt: user?.lastLoginAt ?? null,
			updatedAt: user?.updatedAt ?? null,

      email: dto.email.toLowerCase(),
      username: dto.username.toLowerCase(),
      password: dto.password,

      firstName: normalizeString(dto.firstName),
      lastName: normalizeString(dto.lastName),
      avatarUrl: normalizeString(dto.avatarUrl),
      description: normalizeString(dto.description),
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      phone: normalizeString(dto.phone),
    };
  }

  private handleConflict(e: DatabaseError) {
    const rules = [
      {
        condition:
          e.code === "23505" && e.constraint?.includes("users_email_key"),
        error: "Email already in use",
      },
      {
        condition:
          e.code === "23505" && e.constraint?.includes("users_username_key"),
        error: "Username already in use",
      }
    ];
    for (const rule of rules) {
      if (rule.condition) {
        throw new errors.ConflictError(rule.error);
      }
    }
		throw e;
  }

  async getPage(params: {
    page: string | number | undefined;
    limit: string | number | undefined;
  }) {
    if (
      params.page === "" ||
      params.limit === "" ||
      params.page === undefined ||
      params.limit === undefined
    ) {
      throw new errors.ValidationError(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    }

    const pageNum = Number(params.page);
    const limitNum = Number(params.limit);

    if (
      !Number.isInteger(pageNum) ||
      !Number.isInteger(limitNum) ||
      pageNum < 1 ||
      limitNum < 1 ||
      limitNum > 100
    ) {
      throw new errors.ValidationError(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    }

    const users = await this.repo.getAllUsers();
    const total = users.length;

    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const data: IUser[] = users.slice(start, end);

    return {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getUserById(id: string) {
    if (!id) {
      throw new errors.ValidationError("ID is required");
    }
    if (!validators.isUUID(id)) {
      throw new errors.ValidationError("ID is not valid UUID");
    }

    const user = await this.repo.getUserById(id);
    if (!user) {
      throw new errors.NotFoundError("User not found");
    }
    return user;
  }

  async createUser(dto: IPostUserDto) {
    this.validateUser(dto);
    try {
      return await this.repo.createUser(this.buildUser(dto));
    } catch (e: unknown) {
      this.handleConflict(e as DatabaseError);
    }
  }

  async updateUser(id: string, dto: IPostUserDto) {
    this.validateUser(dto, id, "update");
    try {
      const user = await this.repo.updateUser(id, this.buildUser(dto));
      if (!user) {
        throw new errors.NotFoundError("User not found");
      }
      return user;
    } catch (e: unknown) {
      this.handleConflict(e as DatabaseError);
    }
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new errors.ValidationError("ID is required");
    }
    if (!validators.isUUID(id)) {
      throw new errors.ValidationError("ID is not valid UUID");
    }
    return await this.repo.deleteUser(id);
  }
}
