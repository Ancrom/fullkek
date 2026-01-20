import { vi, describe, it, expect, vitest, afterEach } from "vitest";
import type { IUser } from "../types/UserType";
import {
  transformUser,
  formatDate,
  fetchUsersService
} from "./UserService";
import { usersApi } from "../api/usersApi";

// Mock the same module path that is imported above
vi.mock("../api/usersApi", () => {
  return {
    usersApi: {
      fetchUsers: vitest.fn(),
      fetchById: vitest.fn(),
      create: vitest.fn(),
      update: vitest.fn(),
    },
  };
});

const MOCKED_USER: IUser = {
  id: "1",
  email: "email",
  username: "username",
  emailConfirmed: true,
  role: "user",
  isActive: true,
  firstName: "firstName",
  lastName: "lastName",
  avatarUrl: "avatarUrl",
  description: "description",
  phone: "phone",
  password: "password",
  createdAt: "2022-01-01T00:00:00.000Z",
  lastLoginAt: "2022-01-01T00:00:00.000Z",
  birthday: "2022-01-01T00:00:00.000Z",
};
const DEFAULT_USER: IUser = {
  id: "",
  email: "",
  username: "",
  emailConfirmed: false,
  role: "user",
  isActive: true,
  firstName: "",
  lastName: "",
  avatarUrl: "",
  description: "",
  phone: "",
  password: "",
  createdAt: "",
  lastLoginAt: "",
  birthday: "",
};

describe("formatDate", () => {
  it("formats date correctly", () => {
    expect(formatDate("2022-01-01T00:00:00.000Z")).toEqual("2022-01-01");
  });

  it("returns empty string if date is null or undefined", () => {
		// @ts-expect-error
    expect(formatDate(undefined)).toEqual("");
  });

  it("returns empty string if date is invalid", () => {
    expect(formatDate("invalid-date")).toEqual("");
  });
});

describe("transformUser", () => {
  it("transform User successfully", () => {
    expect(transformUser(MOCKED_USER)).toEqual({
      ...MOCKED_USER,
			createdAt: "2022-01-01",
      lastLoginAt: "2022-01-01",
      birthday: "2022-01-01",
    });
  });

  it("returns default user if param is null", () => {
    // @ts-expect-error
    expect(transformUser(null)).toEqual({
      ...DEFAULT_USER,
    });
  });

  it("returns default user if param is empty object", () => {
    // @ts-expect-error
    expect(transformUser({})).toEqual({
      ...DEFAULT_USER,
    });
  });

  it("returns default user if user is invalid", () => {
    // @ts-expect-error
    expect(transformUser("invalid-user")).toEqual({
      ...DEFAULT_USER,
    });
  });
});

describe("fetchUsersService", () => {
	afterEach(() => {
		vi.clearAllMocks();
	})
  it("fetch users successfully", async () => {
    const mockUsers = {
      data: [MOCKED_USER],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    };
    vi.mocked(usersApi.fetchUsers).mockResolvedValue(mockUsers);

    const result = await fetchUsersService(1, 10);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      ...MOCKED_USER,
			createdAt: "2022-01-01",
      lastLoginAt: "2022-01-01",
      birthday: "2022-01-01",
    });
  });

  it("calls API with default parameters (page = 1, limit = 10)", async () => {
    // @ts-expect-error
    vi.mocked(usersApi.fetchUsers).mockResolvedValue({});
    await fetchUsersService();
    expect(usersApi.fetchUsers).toHaveBeenCalledWith(1, 10);
  });

  it("returns empty array", async () => {
    const mockUsers = {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
    vi.mocked(usersApi.fetchUsers).mockResolvedValue(mockUsers);
    const result = await fetchUsersService(1, 10);
    expect(result.length).toBe(0);
  });

  it("returns empty array if response is invalid", async () => {
    // @ts-expect-error
    vi.mocked(usersApi.fetchUsers).mockResolvedValue(null);
    const result = await fetchUsersService(1, 10);
    expect(result.length).toBe(0);
  });
});
