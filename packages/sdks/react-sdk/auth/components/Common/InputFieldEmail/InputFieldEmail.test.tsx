import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputFieldEmail from "./InputFieldEmail";

describe("InputFieldEmail Component", () => {
  const setEmailMock = jest.fn();
  const defaultProps = {
    email: "",
    setEmail: setEmailMock,
    placeholder: "Enter your email",
    label: "Email",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default props", () => {
    render(<InputFieldEmail {...defaultProps} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  test("displays the correct email value", () => {
    render(<InputFieldEmail {...defaultProps} email="test@example.com" />);

    const input = screen.getByLabelText(/Email/i);
    expect(input).toHaveValue("test@example.com");
  });

  test("calls setEmail function on email input change", () => {
    render(<InputFieldEmail {...defaultProps} />);

    const input = screen.getByLabelText(/Email/i);
    fireEvent.change(input, { target: { value: "new@example.com" } });

    expect(setEmailMock).toHaveBeenCalledWith("new@example.com");
  });

  test("applies custom styling when unstyled prop is true", () => {
    render(<InputFieldEmail {...defaultProps} unstyled />);

    const inputGroup = screen.getByLabelText(/Email/i).closest("div");
    expect(inputGroup).not.toHaveClass("hypership-input-group");
  });
});
