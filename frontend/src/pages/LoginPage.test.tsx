import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "./LoginPage";
import { usersApi } from "../api/usersApi";
import { MemoryRouter } from "react-router-dom";

describe("LoginPage", () => {
  it("should successfully submit the form and redirect", async () => {
		// @ts-expect-error
    const loginSpy = vi.spyOn(usersApi, "login").mockResolvedValue(undefined);

    Object.defineProperty(window, "location", {
      value: {
        href: "",
        search: "",
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/enter your email/i);
    const passwordInput = screen.getByLabelText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(window.location.href).toBe("/users");
    });

    loginSpy.mockRestore();
  });
});
