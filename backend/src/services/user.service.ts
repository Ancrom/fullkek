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
    if (!dto.email || !dto.username || !dto.password) {
      throw new errors.ValidationError(
        "email, username and password are required"
      );
    }
    if (mode === "update" && !id) {
      throw new errors.ValidationError("ID is required");
    }
    if (id && !validators.isUUID(id)) {
      throw new errors.ValidationError("ID is not valid UUID");
    }
    if (dto.email && !validators.isEmail(dto.email)) {
      throw new errors.ValidationError("Email is not valid");
    }
    if (dto.username && !/^[a-zA-Z0-9_]{3,16}$/.test(dto.username)) {
      throw new errors.ValidationError(
        "Username must be between 3 and 16 characters"
      );
    }
    if (dto.password && dto.password.length < 8) {
      throw new errors.ValidationError(
        "Password must be at least 8 characters"
      );
    }
    if (dto.first_name && dto.first_name && dto.first_name.length > 20) {
      throw new errors.ValidationError(
        "First name must be at most 20 characters"
      );
    }
    if (dto.last_name && dto.last_name && dto.last_name.length > 20) {
      throw new errors.ValidationError(
        "Last name must be at most 20 characters"
      );
    }
    if (dto.avatar_url && dto.avatar_url && !validators.isURL(dto.avatar_url)) {
      throw new errors.ValidationError("Avatar URL is not valid");
    }
    if (dto.description && dto.description && dto.description.length > 100) {
      throw new errors.ValidationError(
        "Description must be at most 100 characters"
      );
    }
  }

  private buildUser(dto: IPostUserDto, user?: IUser): IUser {
    return {
      id: user?.id ?? crypto.randomUUID(),

      email_confirmed: user?.email_confirmed ?? false,
      created_at: user?.created_at ?? new Date(),
      role: user?.role ?? "user",
			is_active: user?.is_active ?? true,
			last_login_at: user?.last_login_at ?? null,

      email: dto.email,
      username: dto.username,
      password: dto.password,

      first_name: normalizeString(dto.first_name),
      last_name: normalizeString(dto.last_name),
      avatar_url: normalizeString(dto.avatar_url),
      description: normalizeString(dto.description),
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      phone: normalizeString(dto.phone),
    };
  }

  private handleConflict(e: DatabaseError) {
    if (e.code === "23505") {
      if (e.constraint === "users_email_key") {
        throw new errors.ConflictError("Email already in use");
      }

      if (e.constraint === "users_username_key") {
        throw new errors.ConflictError("Username already in use");
      }

      throw new errors.ConflictError("User already exists");
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
        "Page and limit must be integers. Page >= 1, 1 <= limit <= 100"
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
