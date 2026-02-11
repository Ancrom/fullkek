import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, test, beforeEach } from "vitest";
import { vi } from "vitest";
import AuthForm from "./AuthForm";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

vi.mock("../../../store/useAuthStore", () => ({
  default: vi.fn((selector) => {
    const store = {
      user: null,
      isAuth: false,
      login: mockLogin,
    };
    return selector ? selector(store) : mockLogin;
  }),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete("redirect");
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>,
    );
  };

  describe("Render", () => {
    test("should render email и password", () => {
      renderComponent();

      expect(screen.getByLabelText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/enter your password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    test("show error when email is invalid", async () => {
      const user = userEvent.setup();
      renderComponent();

      const emailInput = screen.getByLabelText(/enter your email/i);
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    test("show error when password is too short", async () => {
      const user = userEvent.setup();
      renderComponent();

      const passwordInput = screen.getByLabelText(/enter your password/i);
      await user.type(passwordInput, "123");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/min 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe("Submit form", () => {
    test("successful submit and redirect", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      renderComponent();

      await user.type(
        screen.getByLabelText(/enter your email/i),
        "test@example.com",
      );
      await user.type(
        screen.getByLabelText(/enter your password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/users");
      });
    });

    test("Redirect to page from searchParams", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);
      mockSearchParams.set("redirect", "/dashboard");

      renderComponent();

      await user.type(
        screen.getByLabelText(/enter your email/i),
        "test@example.com",
      );
      await user.type(
        screen.getByLabelText(/enter your password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Reset button", () => {
    test("clears form fields on click", async () => {
      const user = userEvent.setup();
      renderComponent();

      const emailInput = screen.getByLabelText(
        /enter your email/i,
      ) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /enter your password/i,
      ) as HTMLInputElement;

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });
});
