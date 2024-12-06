import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignUp } from "./SignUp";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

jest.mock("axios");
jest.mock("../../hooks/useHypershipAuth");
jest.mock("../../utils/apiClient", () => ({
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
}));

describe("SignUp Component", () => {
  const mockSignUp = jest.fn();
  const mockOnSignUpSuccess = jest.fn();

  beforeEach(() => {
    (useHypershipAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SignUp form with required fields", () => {
    render(<SignUp onSignUpSuccess={mockOnSignUpSuccess} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText("Password", { selector: "input#password" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Confirm Password", {
        selector: "input#confirm-password",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  test("shows error message if passwords do not match", async () => {
    render(<SignUp onSignUpSuccess={mockOnSignUpSuccess} />);

    fireEvent.change(
      screen.getByLabelText("Password", { selector: "input#password" }),
      {
        target: { value: "password123" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirm Password", {
        selector: "input#confirm-password",
      }),
      {
        target: { value: "differentPassword" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  test("calls signUp with correct values and triggers onSignUpSuccess after successful sign-up", async () => {
    mockSignUp.mockResolvedValueOnce({});
    render(<SignUp onSignUpSuccess={mockOnSignUpSuccess} />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(
      screen.getByLabelText("Password", { selector: "input#password" }),
      {
        target: { value: "Password123!" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirm Password", {
        selector: "input#confirm-password",
      }),
      {
        target: { value: "Password123!" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() =>
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@example.com",
        "Password123!"
      )
    );
    await waitFor(() => expect(mockOnSignUpSuccess).toHaveBeenCalled());
  });

  test("does not apply styling when unstyled is true", () => {
    render(<SignUp onSignUpSuccess={mockOnSignUpSuccess} unstyled={true} />);

    expect(screen.queryByTestId("hypership-container")).not.toBeInTheDocument();
    expect(screen.queryByTestId("hypership-form")).not.toBeInTheDocument();
  });
});
