import { describe, it, expect, vitest, vi, beforeEach } from "vitest";
import * as jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthService } from "../../src/services/auth.service";

vi.mock("jsonwebtoken", () => ({
  sign: vitest.fn(),
  verify: vitest.fn(),
}));
vi.mock("argon2");

describe("AuthService.login", () => {
  let repo: any;
  let service: any;
  const fakeUser = {
    id: "1",
    email: "test@a.com",
    password: "hash",
    role: "user",
    username: "tester",
  };

  beforeEach(() => {
    vitest.clearAllMocks();
    repo = {
      getUserByEmail: vitest.fn(),
      getUserById: vitest.fn(),
    };

    service = new AuthService(repo);
  });

  it("logs in user successfully", async () => {
    const dto = {
      email: "test@a.com",
      password: "password",
    };
    repo.getUserByEmail.mockResolvedValue(fakeUser);
    vi.mocked(argon2.verify).mockResolvedValue(true);
    vi.mocked(jwt.sign).mockReturnValue("fake-access-token" as any);
    const result = await service.login(dto);

    expect(repo.getUserByEmail).toHaveBeenCalledWith(dto.email);
    expect(argon2.verify).toHaveBeenCalledWith(fakeUser.password, dto.password);
    expect(result).toEqual({
      token: "fake-access-token",
      user: {
        id: fakeUser.id,
        email: fakeUser.email,
        username: fakeUser.username,
        role: fakeUser.role,
      },
    });
  });

  it("throws error if user is not found", async () => {
    repo.getUserByEmail.mockResolvedValue(null);
    await expect(
      service.login({
        email: "test@a.com",
        password: "password",
      }),
    ).rejects.toThrow("Invalid email or password");
  });

  it("throws error if password is incorrect", async () => {
    repo.getUserByEmail.mockResolvedValue(fakeUser);
    vi.mocked(argon2.verify).mockResolvedValue(false);
    await expect(
      service.login({
        email: "test@a.com",
        password: "incorrect-password",
      }),
    ).rejects.toThrow("Invalid email or password");
  });

  it.each([
    undefined,
    null,
    "",
    {},
    { email: "email" },
    { password: "password" },
    { email: "invalid-email", password: "password" },
  ])("throws error for invalid input: %o", async (email, password) => {
    await expect(
      service.login({
        email,
        password,
      }),
    ).rejects.toThrow("Invalid email or password");
  });
});

describe("AuthService.checkSession", () => {
  let repo: any;
  let service: any;
  const fakeUser = {
    id: "1",
    email: "test@a.com",
    password: "hash",
    role: "user",
    username: "tester",
  };

  beforeEach(() => {
    vitest.clearAllMocks();
    repo = {
      getUserByEmail: vitest.fn(),
      getUserById: vitest.fn(),
    };

    service = new AuthService(repo);
    process.env.JWT_SECRET = "secret";
  });

  it("checks session successfully", async () => {
    const mockPayload = { sub: fakeUser.id, role: fakeUser.role };

    vi.mocked(jwt.verify).mockReturnValue(mockPayload as any);
    jwt.verify("token", process.env.JWT_SECRET!);
    repo.getUserById.mockResolvedValue(fakeUser);

    const result = await service.checkSession("token");

    expect(repo.getUserById).toHaveBeenCalledWith(fakeUser.id);
    expect(result).toEqual({
      id: fakeUser.id,
      email: fakeUser.email,
      username: fakeUser.username,
      role: fakeUser.role,
    });
  });

  it("throws error if user is not found", async () => {
    repo.getUserById.mockResolvedValue(null);
    await expect(service.checkSession("token")).rejects.toThrow(
      "Invalid or expired token",
    );
  });

  it("throws error if token is invalid", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    await expect(service.checkSession("token")).rejects.toThrow(
      "Invalid or expired token",
    );
  });

  it("throws error if token not provided", async () => {
    await expect(service.checkSession("")).rejects.toThrow("No access token");
  });

  it.each([undefined, null, ""])(
    "throws error for invalid input: %o",
    async (token) => {
      await expect(service.checkSession(token)).rejects.toThrow(
        "No access token",
      );
    },
  );
});

describe("AuthService.refresh", () => {
  let repo: any;
  let service: any;
  beforeEach(() => {
    vitest.clearAllMocks();
    service = new AuthService(repo);
  });

  it("refreshes token successfully", async () => {
    const oldToken = "old-token";
    const payload = { sub: "1", role: "user" };
    const newToken = "new-token";

    vi.mocked(jwt.verify).mockReturnValue(payload as any);
    vi.mocked(jwt.sign).mockReturnValue(newToken as any);

    const result = await service.refresh(oldToken);

    expect(jwt.verify).toHaveBeenCalledWith(oldToken, expect.any(String));
    expect(jwt.sign).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sub: payload.sub,
        role: payload.role,
      }),
      expect.any(String),
      expect.any(Object),
    );
    expect(result).toBe(newToken);
  });

  it.each([
    undefined,
    null,
		""
  ])("throws error for invalid input: %o", async (token) => {
    await expect(
      service.refresh(token),
    ).rejects.toThrow("No access token");
  });
});
