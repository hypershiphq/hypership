import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputFieldPassword from "./InputFieldPassword";

describe("InputFieldPassword Component", () => {
  const setPasswordMock = jest.fn();
  const defaultProps = {
    password: "",
    setPassword: setPasswordMock,
    placeholder: "Enter your password",
    label: "Password",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default props", () => {
    render(<InputFieldPassword {...defaultProps} />);

    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });

  test("displays the correct password value", () => {
    render(<InputFieldPassword {...defaultProps} password="test1234" />);

    const input = screen.getByTestId("password-input");
    expect(input).toHaveValue("test1234");
  });

  test("calls setPassword function on password input change", () => {
    render(<InputFieldPassword {...defaultProps} />);

    const input = screen.getByTestId("password-input");
    fireEvent.change(input, { target: { value: "newPassword" } });

    expect(setPasswordMock).toHaveBeenCalledWith("newPassword");
  });

  test("toggles password visibility when button is clicked", () => {
    render(<InputFieldPassword {...defaultProps} />);

    const input = screen.getByTestId("password-input");
    const toggleButton = screen.getByRole("button", {
      name: /Toggle password visibility/i,
    });

    // Initially, input type should be password
    expect(input).toHaveAttribute("type", "password");

    // Click to toggle visibility
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    // Click again to toggle back
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  test("applies custom styling when unstyled prop is true", () => {
    render(<InputFieldPassword {...defaultProps} unstyled />);

    const input = screen.getByTestId("password-input");
    const inputGroup = input.closest("div"); // Locate the closest wrapping div

    expect(inputGroup).not.toHaveClass("hypership-input-group");
  });
});
