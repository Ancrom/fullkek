import { UserRepository } from "../../src/modules/user.repository";
import { UserService } from "../../src/services/user.serviсe";
import { IUser } from "../../src/types/user.types";

describe("UserService", () => {
  let userService: UserService;
  let repo: UserRepository;
  let seededUser: IUser;

  beforeEach(() => {
    repo = new UserRepository();
    userService = new UserService(repo);
    seededUser = userService.createUser({
      email: "test@test.com",
      username: "testuser",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      avatarUrl: "https://example.com/avatar.jpg",
      description: "Seed user",
      birthday: new Date("2000-01-01"),
      phoneNumber: "1234567890",
    });
  });

  // Create user
  describe("createUser", () => {
    it("should not allow duplicate users", () => {
      expect(() => {
        userService.createUser({
          email: "test@test.com",
          username: "testuser",
          password: "hashedpassword",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "https://example.com/avatar.jpg",
          description: "Seed user",
          birthday: new Date("2000-01-01"),
          phoneNumber: "1234567890",
        });
      }).toThrow("User already exists");
    });
    it("should require email, username, and password", () => {
      expect(() => {
        userService.createUser({
          email: "test2@test.com",
          username: "testuser2",
          password: "",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "https://example.com/avatar.jpg",
          description: "Seed user",
          birthday: new Date("2000-01-01"),
          phoneNumber: "1234567890",
        });
      }).toThrow("email, username and password are required");
    });
    it("should create a new user", () => {
      const user = userService.createUser({
        email: "test3@test.com",
        username: "testuser3",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "User",
        avatarUrl: "https://example.com/avatar.jpg",
        description: "Seed user",
        birthday: new Date("2000-01-01"),
        phoneNumber: "1234567890",
      });
      expect(user.id).toBeDefined();
    });
  });

  // getPage
  describe("getPage", () => {
    it("should throw an error for invalid page or limit", () => {
      expect(() => {
        userService.getPage({ page: -1, limit: -10 });
      }).toThrow(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    });
    it("should throw an error for invalid page or limit", () => {
      expect(() => {
        userService.getPage({ page: 1, limit: 100000 });
      }).toThrow(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    });
    it("should throw an error for invalid page or limit", () => {
      expect(() => {
        userService.getPage({ page: "abc", limit: "abc" });
      }).toThrow(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    });
    it("should throw an error for invalid page or limit", () => {
      expect(() => {
        userService.getPage({ page: "", limit: "" });
      }).toThrow(
        "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
      );
    });
    it("should get a list of users", () => {
      const users = userService.getPage({ page: 1, limit: 10 });
      expect(users.data.length).toBe(1);
    });
  });

  // getUserById
  describe("getUserById", () => {
    it("should get a user by id", () => {
      const user = userService.getUserById(seededUser.id);
      expect(user.id).toBe(seededUser.id);
    });
    it("should throw an error for missing id", () => {
      expect(() => {
        userService.getUserById("");
      }).toThrow("ID is required");
    });
    it("should throw an error for invalid id", () => {
      expect(() => {
        userService.getUserById("invalid-id");
      }).toThrow("ID is not valid UUID");
    });
    it("should throw an error for user not found", () => {
      const nonExistentId = seededUser.id.slice(0, -1) + "1";
      expect(() => {
        userService.getUserById(nonExistentId);
      }).toThrow("User not found");
    });
  });

  // updateUser
  describe("updateUser", () => {
    it("should update a user", () => {
      const updatedUser = userService.updateUser(seededUser.id, {
        email: "updated@test.com",
        username: "updateduser",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "User",
        avatarUrl: "https://example.com/avatar.jpg",
        description: "Seed user",
        birthday: new Date("2000-01-01"),
        phoneNumber: "1234567890",
      });
      expect(updatedUser.email).toBe("updated@test.com");
    });
    it("should throw an error for missing id", () => {
      expect(() => {
        userService.updateUser("", {
          email: "updated@test.com",
          username: "updateduser",
          password: "hashedpassword",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "https://example.com/avatar.jpg",
          description: "Seed user",
          birthday: new Date("2000-01-01"),
          phoneNumber: "1234567890",
        });
      }).toThrow("ID is required");
    });
    it("should throw an error for invalid id", () => {
      expect(() => {
        userService.updateUser("invalid-id", {
          email: "updated@test.com",
          username: "updateduser",
          password: "hashedpassword",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "https://example.com/avatar.jpg",
          description: "Seed user",
          birthday: new Date("2000-01-01"),
          phoneNumber: "1234567890",
        });
      }).toThrow("ID is not valid UUID");
    });
  });

  // deleteUser
  describe("deleteUser", () => {
    it("should delete a user", () => {
      userService.deleteUser(seededUser.id);
      expect(repo.getUserById(seededUser.id)).toBeUndefined();
    });
    it("should throw an error for missing id", () => {
      expect(() => {
        userService.deleteUser("");
      }).toThrow("ID is required");
    });
    it("should throw an error for invalid id", () => {
      expect(() => {
        userService.deleteUser("invalid-id");
      }).toThrow("ID is not valid UUID");
    });
  });
});
