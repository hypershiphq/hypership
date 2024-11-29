import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonSecondary from "./ButtonSecondary";
import sharedStyles from "../../AuthComponents.module.css";

describe("ButtonSecondary Component", () => {
  test("renders with default properties and displays the label", () => {
    render(<ButtonSecondary buttonLabel="Cancel" />);

    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(sharedStyles["hypership-button-secondary"]);
  });

  test("calls onClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(<ButtonSecondary buttonLabel="Cancel" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders Spinner and disables button when loading is true", () => {
    render(<ButtonSecondary buttonLabel="Cancel" loading />);

    // Check for the Spinner SVG element by test ID
    const spinner = screen.getByTestId("spinner");
    const button = screen.getByRole("button");
    expect(spinner).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("applies no styling when unstyled is true", () => {
    render(<ButtonSecondary buttonLabel="Cancel" unstyled />);

    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).not.toHaveClass(sharedStyles["hypership-button-secondary"]);
  });
});
