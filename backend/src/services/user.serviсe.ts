import type { IUser, CreateUserDto, UpdateUserDto } from "../types/user.types";
import { UserRepository } from "../modules/user.repository";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../errors/HttpError";

type PaginationParams = {
  page: string | number | undefined;
  limit: string | number | undefined;
};

export class UserService {
  constructor(private repo: UserRepository) {
    this.repo = repo;
  }

  isUUID(id: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );
  }

  isEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isUsername(username: string) {
    return /^[a-zA-Z0-9_]{3,16}$/.test(username);
  }

  isURL(url: string) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    );
  }

  validateUser(
    dto: CreateUserDto | UpdateUserDto,
    isCreate: boolean = true,
    id?: string
  ) {
    if (!dto.email || !dto.username || !dto.password) {
      throw new ValidationError("email, username and password are required");
    }

    if (!isCreate && !id) {
      throw new ValidationError("ID is required");
    }

    if (id && !this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }

    if (dto.email && !this.isEmail(dto.email)) {
      throw new ValidationError("Email is not valid");
    }

    if (dto.username && !this.isUsername(dto.username)) {
      throw new ValidationError("Username must be between 3 and 16 characters");
    }

    if (dto.password && dto.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    if (dto.firstName && dto.firstName && dto.firstName.length > 20) {
      throw new ValidationError("First name must be at most 20 characters");
    }

    if (dto.lastName && dto.lastName && dto.lastName.length > 20) {
      throw new ValidationError("Last name must be at most 20 characters");
    }

    if (dto.avatarUrl && dto.avatarUrl && !this.isURL(dto.avatarUrl)) {
      throw new ValidationError("Avatar URL is not valid");
    }

    if (dto.description && dto.description && dto.description.length > 100) {
      throw new ValidationError("Description must be at most 100 characters");
    }
  }

  private buildUser(dto: CreateUserDto | UpdateUserDto, user?: IUser): IUser {
    return {
      id: user?.id ?? crypto.randomUUID(),

      emailVerified: user?.emailVerified ?? false,
      createdAt: user?.createdAt ?? new Date(),
      role: user?.role ?? "user",
      isActive: user?.isActive ?? true,
      lastLoginAt: user?.lastLoginAt ?? null,

      email: dto.email,
      username: dto.username,
      password: dto.password,

      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
      avatarUrl: dto.avatarUrl ?? null,
      description: dto.description ?? null,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      phoneNumber: dto.phoneNumber ?? null,
    };
  }

  getPage(params: PaginationParams) {
    if (
      params.page === "" ||
      params.limit === "" ||
      params.page === undefined ||
      params.limit === undefined
    ) {
      throw new ValidationError(
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
      throw new ValidationError(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    }

    const users = this.repo.getAllUsers();
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

  getUserById(id: string) {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }

    const user = this.repo.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  createUser(dto: CreateUserDto) {
    this.validateUser(dto);

    for (const user of this.repo.getAllUsers()) {
      if (
        (dto.email && user.email === dto.email) ||
        (dto.username && user.username === dto.username)
      ) {
        throw new ConflictError("Email or username already in use");
      }
    }

    return this.repo.createUser(this.buildUser(dto));
  }

  updateUser(id: string, dto: UpdateUserDto): IUser {
    this.validateUser(dto, false, id);

    let conflictUser: IUser | undefined;
    let existsUser: IUser | undefined;

    for (const user of this.repo.getAllUsers()) {
      if (user.id === id) {
        existsUser = user;
      }
      if (
        user.id !== id &&
        ((dto.email && user.email === dto.email) ||
          (dto.username && user.username === dto.username))
      ) {
        conflictUser = user;
      }

      if (existsUser && conflictUser) {
        break;
      }
    }

    if (!existsUser) {
      throw new NotFoundError("User not found");
    }
    if (conflictUser) {
      throw new ConflictError("Email or username already in use");
    }

    const updatedUser = this.buildUser(dto, existsUser);

    return this.repo.updateUser(id, updatedUser);
  }

  deleteUser(id: string) {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }
    return this.repo.deleteUser(id);
  }
}
