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
    if (!dto.email || !dto.username || !dto.password) {
      throw new ValidationError("email, username and password are required");
    }

    const userExists = this.repo.getUserByEmailOrUsername(
      dto.email,
      dto.username
    );
    if (userExists) {
      throw new ConflictError("User already exists");
    }

    const user: IUser = {
      id: crypto.randomUUID(),

      email: dto.email,
      username: dto.username,
      password: dto.password,

      emailVerified: false,
      createdAt: new Date(),
      role: "user",
      isActive: true,
      lastLoginAt: null,

      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
      avatarUrl: dto.avatarUrl ?? null,
      description: dto.description ?? null,
      birthday: dto.birthday ?? null,
      phoneNumber: dto.phoneNumber ?? null,
    };

    return this.repo.createUser(user);
  }

  updateUser(id: string, dto: UpdateUserDto): IUser {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }

    const userExists = this.repo.getUserById(id);
    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    const conflict = this.repo.getUserByEmailOrUsername(
      dto.email,
      dto.username
    );

    if (conflict && conflict.id !== id) {
      throw new ConflictError("Email or username already in use");
    }

    const updatedUser: IUser = {
      id: id,

      emailVerified: userExists.emailVerified,
      createdAt: userExists.createdAt,
      role: userExists.role,
      isActive: userExists.isActive,
      lastLoginAt: userExists.lastLoginAt,

      email: dto.email,
      username: dto.username,
      password: dto.password,

      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
      avatarUrl: dto.avatarUrl ?? null,
      description: dto.description ?? null,
      birthday: dto.birthday ?? null,
      phoneNumber: dto.phoneNumber ?? null,
    };

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
