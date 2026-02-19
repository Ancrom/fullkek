import { userMapper } from "../../src/mappers/userMapper";
import type { IUser } from "../../src/types/user.types";

describe("userMapper", () => {
  const RAW_USER: any = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "test@test.com",
    username: "username",
    email_confirmed: false,
    created_at: new Date("2022-01-01"),
    updated_at: new Date("2022-01-01"),
    role: "user",
    is_active: true,
    last_login_at: new Date("2022-01-01"),
    password: "password",
    first_name: "John",
    last_name: "Doe",
    avatar_url: "https://example.com/avatar.jpg",
    description: "Software developer",
    birthday: new Date(),
    phone: "1234567890",
  };
  const EXPECTED_USER: IUser = {
    id: RAW_USER.id,
    email: RAW_USER.email,
    username: RAW_USER.username,
    emailConfirmed: RAW_USER.email_confirmed,
    createdAt: RAW_USER.created_at,
    updatedAt: RAW_USER.updated_at,
    role: RAW_USER.role,
    isActive: RAW_USER.is_active,
    lastLoginAt: RAW_USER.last_login_at,
    password: RAW_USER.password,
    firstName: RAW_USER.first_name,
    lastName: RAW_USER.last_name,
    avatarUrl: RAW_USER.avatar_url,
    description: RAW_USER.description,
    birthday: RAW_USER.birthday,
    phone: RAW_USER.phone,
  };

	it("should map raw user data to IUser", () => {
		const result = userMapper(RAW_USER);
		expect(result).toEqual(EXPECTED_USER);
	});

  it("should return undefined for missing optional fields", () => {
    const raw = { id: 1, email: "test@test.com" };
		// @ts-expect-error
		const result = userMapper(raw);
		expect(result.id).toBe(raw.id);
		expect(result.username).toBeUndefined();
		expect(result.avatarUrl).toBeUndefined();
  });

	it('should throw error or handle null input', () => {
		// @ts-expect-error
		expect(() => userMapper(null)).toThrow()
	})
});
