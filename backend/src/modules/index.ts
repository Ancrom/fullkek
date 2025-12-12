import { UserRepository } from "./UserRepository";

export const userRepository = new UserRepository();

userRepository.createUser({
  email: "test@test.com",
  username: "testuser",
  password: "hashedpassword",
  firstName: "Test",
  lastName: "User",
  avatarUrl: "https://example.com/avatar.jpg",
  description: "This is a test user",
  birthday: new Date("2000-01-01"),
  phoneNumber: "+1234567890",
});

userRepository.updateUser("1", {
  email: "test@test.com",
  username: "updateduser",
  password: "hashedpassword",
  firstName: "Test",
  lastName: "User",
  avatarUrl: "https://example.com/avatar.jpg",
  description: "This is a test user",
  birthday: new Date("2000-01-01"),
  phoneNumber: "+1234567890",
});
