import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";

vi.mock("../../components/Login/Login", () => {
  return {
    default: () => <div data-testid="login-component">Login Component</div>,
  };
});

describe("LoginPage", () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );
  };

  test("renders login component", () => {
    renderComponent();

    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  test("renders just the login component without the main layout", () => {
    const { container } = renderComponent();

    expect(
      container.querySelector('[data-testid="login-component"]'),
    ).toBeInTheDocument();
  });
});
