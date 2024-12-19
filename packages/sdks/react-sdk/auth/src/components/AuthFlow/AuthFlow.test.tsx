import { fireEvent, waitFor } from "@testing-library/react";

import React from "react";
import { render, screen } from "@testing-library/react";
import HypershipAuth from "./AuthFlow";
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

describe("HypershipAuth Component", () => {
  const onAuthSuccessMock = jest.fn();
  const mockSignIn = jest.fn();
  const mockSignUp = jest.fn((_, onSuccess) => onSuccess());
  beforeEach(() => {
    (useHypershipAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SignIn component initially", () => {
    render(<HypershipAuth onAuthSuccess={onAuthSuccessMock} />);

    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Don't have an account\? Sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Forgot Password\?/i })
    ).toBeInTheDocument();
  });

  test("switches to PasswordReset component when Forgot Password button is clicked", () => {
    render(<HypershipAuth onAuthSuccess={onAuthSuccessMock} />);

    // Simulate clicking the "Forgot Password?" button
    const forgotPasswordButton = screen.getByRole("button", {
      name: /Forgot Password\?/i,
    });
    fireEvent.click(forgotPasswordButton);

    // Verify that PasswordReset component is now displayed
    expect(
      screen.getByRole("button", { name: /Reset Password/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Back to Sign In/i })
    ).toBeInTheDocument();
  });

  test("switches to SignUp component when Sign Up button is clicked", () => {
    render(<HypershipAuth onAuthSuccess={onAuthSuccessMock} />);

    // Click on "Sign up" button to change to SignUp view
    const signUpButton = screen.getByRole("button", {
      name: /Don't have an account\? Sign up/i,
    });
    fireEvent.click(signUpButton);

    // Verify that SignUp component is now displayed
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Already have an account\? Sign in/i })
    ).toBeInTheDocument();
  });

  test("switches to ConfirmUserAccount component after successful sign-up", async () => {
    render(<HypershipAuth onAuthSuccess={onAuthSuccessMock} />);

    // Navigate to "Sign Up" view
    const signUpButton = screen.getByRole("button", {
      name: /Don't have an account\? Sign up/i,
    });
    fireEvent.click(signUpButton);

    // Simulate successful sign-up
    const createAccountButton = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(createAccountButton);

    // Verify that ConfirmUserAccount component is now displayed
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Confirm Account/i })
      ).toBeInTheDocument();
    });
  });
});
