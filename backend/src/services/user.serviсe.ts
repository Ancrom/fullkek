import { validate } from "uuid";
import type { UserDto } from "../types/user.types";
import { UserRepository } from "../modules/user.repository";

export class userService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
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
      throw new Error("ID is required");
    }
    if (!validate(id)) {
      throw new Error("ID is not valid");
    }

    const user = this.userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.getUserById(id);
  }

  createUser(user: UserDto) {
    const missedFields = this.validadeUser(user);

    if (missedFields) {
      throw new Error(`The following fields are required: ${missedFields}`);
    }

    const userExists = this.userRepository.getUserByEmailOrUsername(
      user.email,
      user.username
    );
    if (userExists) {
      throw new Error("User already exists");
    }
    return this.userRepository.createUser(user);
  }

  updateUser(id: string, user: UserDto) {
    if (!id) {
      throw new Error("ID is required");
    }
    if (!validate(id)) {
      throw new Error("ID is not valid UUID");
    }

    const missedFields = this.validadeUser(user);
    const updatedUser = this.userRepository.updateUser(id, user);

    if (!updatedUser) {
      throw new Error("User not found");
    }
    if (missedFields) {
      throw new Error(`The following fields are required: ${missedFields}`);
    }

    return updatedUser;
  }

  deleteUser(id: string) {
    if (!validate(id)) {
      throw new Error("ID is not valid");
    }
    return this.userRepository.deleteUser(id);
  }
}
