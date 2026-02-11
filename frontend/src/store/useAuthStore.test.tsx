import { describe, it, expect, vi, beforeEach } from "vitest";
import { usersApi } from "../api/usersApi";
import useAuthStore from "../store/useAuthStore";

const initialState = useAuthStore.getState();
const resetStore = () => useAuthStore.setState(initialState, true);

vi.mock("../api/usersApi", () => ({
  usersApi: {
    login: vi.fn(),
  },
}));

describe("AuthStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it("should login successfully", async () => {
    const mockUser = {
      id: "123",
      email: "test@test.com",
      username: "testuser",
      role: "user" as const,
    };

    vi.mocked(usersApi.login).mockResolvedValue(mockUser);

    const { login } = useAuthStore.getState();

    // Запускаем экшен
    await login({ email: "test@test.com", password: "password" });

    const state = useAuthStore.getState();
    expect(state.authStatus.type).toBe("SUCCESS");
    expect(state.authStatus.user).toEqual(mockUser);
  });

  it("should set auth status to ERROR if login fails", async () => {
    vi.mocked(usersApi.login).mockRejectedValue(new Error("Unauthorized"));

    const { login } = useAuthStore.getState();

    await expect(login({ email: "bad", password: "bad" })).rejects.toThrow();

    const state = useAuthStore.getState();
    expect(state.authStatus.type).toBe("ERROR");
    expect(state.authStatus.user).toBeNull();
  });

  it("should reset auth status", () => {
    useAuthStore.setState({
      authStatus: { type: "SUCCESS", user: { id: 1 } as any },
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().authStatus.type).toBe("IDLE");
  });
});
