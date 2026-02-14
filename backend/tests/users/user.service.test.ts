import { UserService } from "../../src/services/user.service";

describe("UserService.createUser", () => {
  const repo = {
    getPage: vitest.fn(),
    getUserById: vitest.fn(),
    createUser: vitest.fn(),
    updateUser: vitest.fn(),
    deleteUser: vitest.fn(),
  } as any;

  const service = new UserService(repo);
  let userFields = {
    email: "test@test.com",
    username: "username",
    password: "password",
    firstName: "John",
    lastName: "Doe",
    avatarUrl: "https://example.com/avatar.jpg",
    description: "Software developer",
    birthday: "2025-12-25",
    phone: "1234567890",
  };

  it("creates user successfully", async () => {
    repo.createUser.mockResolvedValue({ id: "1", ...userFields } as any);
    const result = await service.createUser({
      ...userFields,
    });

    expect(repo.createUser).toHaveBeenCalled();
    expect(result!.id).toBe("1");
  });

  it("throws error if email already in use", async () => {
    repo.createUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_email_key",
      }),
    );

    await expect(
      service.createUser({
        ...userFields,
      } as any),
    ).rejects.toThrow("Email already in use");
  });

  it("throws error if username already in use", async () => {
    repo.createUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_username_key",
      }),
    );

    await expect(
      service.createUser({
        ...userFields, // different email, but same username
      } as any),
    ).rejects.toThrow("Username already in use");
  });

  it("throws error if email already in use (case insensitive)", async () => {
    repo.createUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_email_key",
      }),
    );

    await expect(
      service.createUser({
        ...userFields,
        email: "TEST@TEST.COM", // uppercase, but should conflict with lowercase
      } as any),
    ).rejects.toThrow("Email already in use");
  });

  it("throws error if username already in use (case insensitive)", async () => {
    repo.createUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_username_key",
      }),
    );

    await expect(
      service.createUser({
        ...userFields,
        username: "USERNAME", // uppercase, but should conflict with lowercase
      } as any),
    ).rejects.toThrow("Username already in use");
  });

  it("throws error if email is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        email: "invalid-email",
      } as any),
    ).rejects.toThrow("Email is not valid");
  });

  it("throws error if username is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        username: "invalid-username",
      } as any),
    ).rejects.toThrow("Username must be between 3 and 16 characters");
  });

  it("throws error if password is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        password: "invalid", // less than 8 characters
      } as any),
    ).rejects.toThrow("Password must be at least 8 characters");
  });

  it("throws error if first name is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        firstName: "fffffffffffffffffffff", // more than 20 characters
      } as any),
    ).rejects.toThrow("First name must be at most 20 characters");
  });

  it("throws error if last name is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        lastName: "fffffffffffffffffffff", // more than 20 characters
      } as any),
    ).rejects.toThrow("Last name must be at most 20 characters");
  });

  it("throws error if avatar URL is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        avatarUrl: "invalid-url", // invalid URL
      } as any),
    ).rejects.toThrow("Avatar URL is not valid");
  });

  it("throws error if description is invalid", async () => {
    await expect(
      service.createUser({
        ...userFields,
        description:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma", // more than 100 characters
      } as any),
    ).rejects.toThrow("Description must be at most 100 characters");
  });
});

describe("UserService.updateUser", () => {
  const repo = {
    getUserById: vitest.fn(),
    createUser: vitest.fn(),
    updateUser: vitest.fn(),
    deleteUser: vitest.fn(),
  } as any;

  const service = new UserService(repo);
  const userId = "550e8400-e29b-41d4-a716-446655440000";
  let userFields = {
    email: "test@test.com",
    username: "username",
    password: "password",
    firstName: "John",
    lastName: "Doe",
    avatarUrl: "https://example.com/avatar.jpg",
    description: "Software developer",
    birthday: "2025-12-25",
    phone: "1234567890",
  };

  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it("updates user successfully", async () => {
    const updatedUser = { id: userId, ...userFields, firstName: "Jane" };
    repo.updateUser.mockResolvedValue(updatedUser);

    const result = await service.updateUser(userId, {
      ...userFields,
      firstName: "Jane",
    });

    expect(repo.updateUser).toHaveBeenCalled();
    expect(result!.id).toBe(userId);
    expect(result!.firstName).toBe("Jane");
  });

  it("throws error if user not found", async () => {
    repo.updateUser.mockResolvedValue(null);

    await expect(
      service.updateUser(userId, {
        ...userFields,
      } as any),
    ).rejects.toThrow("User not found");
  });

  it("throws error if ID is missing", async () => {
    await expect(
      service.updateUser("", {
        ...userFields,
      } as any),
    ).rejects.toThrow("ID is required");
  });

  it("throws error if ID is not valid UUID", async () => {
    await expect(
      service.updateUser("invalid-id", {
        ...userFields,
      } as any),
    ).rejects.toThrow("ID is not valid UUID");
  });

  it("throws error if email already in use", async () => {
    repo.updateUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_email_key",
      }),
    );

    await expect(
      service.updateUser(userId, {
        ...userFields,
      } as any),
    ).rejects.toThrow("Email already in use");
  });

  it("throws error if username already in use", async () => {
    repo.updateUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_username_key",
      }),
    );

    await expect(
      service.updateUser(userId, {
        ...userFields,
      } as any),
    ).rejects.toThrow("Username already in use");
  });

  it("throws error if email already in use (case insensitive)", async () => {
    repo.updateUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_email_key",
      }),
    );

    await expect(
      service.updateUser(userId, {
        ...userFields,
        email: "TEST@TEST.COM", // uppercase, but should conflict with lowercase
      } as any),
    ).rejects.toThrow("Email already in use");
  });

  it("throws error if username already in use (case insensitive)", async () => {
    repo.updateUser.mockRejectedValue(
      Object.assign(new Error(), {
        code: "23505",
        constraint: "users_username_key",
      }),
    );

    await expect(
      service.updateUser(userId, {
        ...userFields,
        username: "USERNAME", // uppercase, but should conflict with lowercase
      } as any),
    ).rejects.toThrow("Username already in use");
  });

  it("throws error if email is invalid", async () => {
    await expect(
      service.updateUser(userId, {
        ...userFields,
        email: "invalid-email",
      } as any),
    ).rejects.toThrow("Email is not valid");
  });

  it("throws error if username is invalid", async () => {
    await expect(
      service.updateUser(userId, {
        ...userFields,
        username: "ab", // less than 3 characters
      } as any),
    ).rejects.toThrow("Username must be between 3 and 16 characters");
  });

  it("throws error if password is invalid", async () => {
    await expect(
      service.updateUser(userId, {
        ...userFields,
        password: "short", // less than 8 characters
      } as any),
    ).rejects.toThrow("Password must be at least 8 characters");
  });
});

describe("UserService.deleteUser", () => {
  const repo = {
    getUserById: vitest.fn(),
    createUser: vitest.fn(),
    updateUser: vitest.fn(),
    deleteUser: vitest.fn(),
  } as any;

  const service = new UserService(repo);
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it("deletes user successfully", async () => {
    repo.deleteUser.mockResolvedValue(undefined);

    await service.deleteUser(userId);

    expect(repo.deleteUser).toHaveBeenCalledWith(userId);
  });

  it("throws error if ID is missing", async () => {
    await expect(service.deleteUser("")).rejects.toThrow("ID is required");
  });

  it("throws error if ID is not valid UUID", async () => {
    await expect(service.deleteUser("invalid-id")).rejects.toThrow(
      "ID is not valid UUID",
    );
  });
});

describe("UserService.getPage", () => {
  const repo = {
    getPage: vitest.fn(),
    getCount: vitest.fn(),
    getUserById: vitest.fn(),
    createUser: vitest.fn(),
    updateUser: vitest.fn(),
    deleteUser: vitest.fn(),
  } as any;

  const service = new UserService(repo);

  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it("returns paginated users successfully", async () => {
    const mockUsers = Array.from({ length: 25 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@test.com`,
      username: `user${i}`,
    }));
    const mockCount = 50;

    repo.getPage.mockResolvedValue(mockUsers);
    repo.getCount.mockResolvedValue(mockCount);

    const result = await service.getPage({ page: 1, limit: 25 });

    expect(repo.getPage).toHaveBeenCalled();
    expect(repo.getPage).toHaveBeenCalledWith(0, 25);
    expect(repo.getCount).toHaveBeenCalled();
    expect(result.data).toHaveLength(25);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(25);
    expect(result.pagination.total).toBe(50);
    expect(result.pagination.totalPages).toBe(2);
  });

  it("returns correct page for second page", async () => {
    const secondPageUsers = Array.from({ length: 10 }, (_, i) => ({
      id: `user-${i + 10}`,
      email: `user${i + 10}@test.com`,
      username: `user${i + 10}`,
    }));

    repo.getPage.mockResolvedValue(secondPageUsers);
    repo.getCount.mockResolvedValue(50);

    const result = await service.getPage({ page: 2, limit: 10 });

    expect(result.data).toHaveLength(10);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.total).toBe(50);
    expect(result.data[0].id).toBe("user-10");

    expect(repo.getPage).toHaveBeenCalledWith(10, 10);
  });

  it("returns correct page for last page with partial results", async () => {
    const mockUsers = Array.from({ length: 5 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@test.com`,
      username: `user${i}`,
    }));

    repo.getPage.mockResolvedValue(mockUsers);
    repo.getCount.mockResolvedValue(25);

    const result = await service.getPage({ page: 3, limit: 10 });

    expect(result.data).toHaveLength(5);
    expect(result.pagination.page).toBe(3);
    expect(result.pagination.totalPages).toBe(3);
  });

  it("handles string page and limit parameters", async () => {
    const mockUsers = Array.from({ length: 5 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@test.com`,
      username: `user${i}`,
    }));

    repo.getPage.mockResolvedValue(mockUsers);
    repo.getCount.mockResolvedValue(25);

    const result = await service.getPage({ page: "2", limit: "5" });

    expect(result.pagination.page).toBe(2);
    expect(result.pagination.limit).toBe(5);
    expect(result.data).toHaveLength(5);
  });

  it("throws error if page is missing", async () => {
    await expect(
      service.getPage({ page: undefined, limit: 10 }),
    ).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is missing", async () => {
    await expect(
      service.getPage({ page: 1, limit: undefined }),
    ).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if page is empty string", async () => {
    await expect(service.getPage({ page: "", limit: 10 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is empty string", async () => {
    await expect(service.getPage({ page: 1, limit: "" })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if page is less than 1", async () => {
    await expect(service.getPage({ page: 0, limit: 10 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is less than 1", async () => {
    await expect(service.getPage({ page: 1, limit: 0 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is greater than 100", async () => {
    await expect(service.getPage({ page: 1, limit: 101 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if page is not an integer", async () => {
    await expect(service.getPage({ page: 1.5, limit: 10 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is not an integer", async () => {
    await expect(service.getPage({ page: 1, limit: 10.5 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if page is not a number", async () => {
    await expect(service.getPage({ page: "abc", limit: 10 })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });

  it("throws error if limit is not a number", async () => {
    await expect(service.getPage({ page: 1, limit: "abc" })).rejects.toThrow(
      "Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100",
    );
  });
});
