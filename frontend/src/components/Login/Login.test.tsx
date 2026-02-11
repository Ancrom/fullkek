import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { describe, expect, test } from "vitest";

vi.mock("../forms/AuthForm/AuthForm", () => ({
  default: () => <div data-testid="auth-form">Auth Form</div>,
}));

import Login from "./Login";

describe("Login - Simple", () => {
  test("renders title", () => {
    render(<Login />);

    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });

  test("Renders AuthForm component", () => {
    render(<Login />);

    expect(screen.getByTestId("auth-form")).toBeInTheDocument();
  });

  test("title is h1", () => {
    render(<Login />);

    const heading = screen.getByText("Login screen");
    expect(heading.tagName).toBe("H1");
  });
});
