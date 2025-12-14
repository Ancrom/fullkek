// tests/users/users.seed.ts
import { UserService } from "../../src/services/user.serviсe";

export function seedUsers(userService: UserService) {
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
}
