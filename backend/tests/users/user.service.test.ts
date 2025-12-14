import { UserRepository } from "../../src/modules/user.repository";
import { UserService } from "../../src/services/user.serviсe";
import { seedUsers } from "./users.seed";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    userService = new UserService(userRepository);
    seedUsers(userService);
  });

  it("should get all users", () => {
    const users = userService.getAllUsers();
    expect(users.length).toBe(1);
  });

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
});
