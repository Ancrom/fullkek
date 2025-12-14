import type { UserDto } from "../types/user.types";
import { UserRepository } from "../modules/user.repository";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../errors/HttpError";

export class UserService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  isUUID(id: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );
  }

  validadeUser(user: UserDto) {
    const requiredFields: (keyof UserDto)[] = [
      "email",
      "username",
      "password",
      "firstName",
      "lastName",
      "avatarUrl",
      "description",
      "birthday",
      "phoneNumber",
    ];

    const missedFields: (keyof UserDto)[] = [];

    requiredFields.forEach((field) => {
      if (
        user[field] === undefined ||
        user[field] === null ||
        user[field] === ""
      ) {
        missedFields.push(field);
      }
    });

    return missedFields.length === 0 ? null : missedFields.join(", ");
  }

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  getUserById(id: string) {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }

    const user = this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.userRepository.getUserById(id);
  }

  createUser(user: UserDto) {
    const missedFields = this.validadeUser(user);

    if (missedFields) {
      throw new ValidationError(
        `The following fields are required: ${missedFields}`
      );
    }

    const userExists = this.userRepository.getUserByEmailOrUsername(
      user.email,
      user.username
    );
    if (userExists) {
      throw new ConflictError("User already exists");
    }
    return this.userRepository.createUser(user);
  }

  updateUser(id: string, user: UserDto) {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }

    const missedFields = this.validadeUser(user);
    const updatedUser = this.userRepository.updateUser(id, user);

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    if (missedFields) {
      throw new ValidationError(
        `The following fields are required: ${missedFields}`
      );
    }

    return updatedUser;
  }

  deleteUser(id: string) {
    if (!this.isUUID(id)) {
      throw new ValidationError("ID is not valid UUID");
    }
    return this.userRepository.deleteUser(id);
  }
}
