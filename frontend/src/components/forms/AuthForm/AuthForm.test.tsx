import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AuthForm from "./AuthForm";

const submitAuthFormMock = vi.fn();
vi.mock("./AuthForm.submit", () => {
  return {
    submitAuthForm: (...args: unknown[]) => submitAuthFormMock(...args),
  };
});

describe("AuthForm", () => {
  it("renders form fields and buttons", () => {
    render(<AuthForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("shows validation errors on submit (user action)", async () => {
    submitAuthFormMock.mockResolvedValue(undefined);
    render(<AuthForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(submitAuthFormMock).not.toHaveBeenCalled();
  });

  it("shows loading state during submit (spinner + disabled)", async () => {
    submitAuthFormMock.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<AuthForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password1");

    const submitBtn = screen.getByRole("button", { name: "Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(submitAuthFormMock).toHaveBeenCalledTimes(1);
    expect(
      container.querySelector('use[href="#icon-spinner"]'),
    ).toBeInTheDocument();
  });

  it("renders status message set by submit handler", async () => {
    submitAuthFormMock.mockImplementation((_values: any, helpers: any) => {
      helpers.setStatus({ type: "success", message: "OK" });
      helpers.setSubmitting(false);
      return Promise.resolve();
    });

    render(<AuthForm />);

    await userEvent.type(screen.getByLabelText(/Email/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password1");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("OK")).toBeInTheDocument();
  });
});
