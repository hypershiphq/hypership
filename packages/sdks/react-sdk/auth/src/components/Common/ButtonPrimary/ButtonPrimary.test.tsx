import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonPrimary from "./ButtonPrimary";
import * as sharedStyles from "../../AuthComponents.module.css";;

describe("ButtonPrimary Component", () => {
  test("renders with default properties and displays the label", () => {
    render(<ButtonPrimary buttonLabel="Click Me" />);

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(sharedStyles["hypership-button-primary"]);
  });

  test("calls onClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(<ButtonPrimary buttonLabel="Click Me" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders Spinner and disables button when loading is true", () => {
    render(<ButtonPrimary buttonLabel="Click Me" loading />);

    // Check for the Spinner SVG element by test ID
    const spinner = screen.getByTestId("spinner");
    const button = screen.getByRole("button");
    expect(spinner).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("applies no styling when unstyled is true", () => {
    render(<ButtonPrimary buttonLabel="Click Me" unstyled />);

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).not.toHaveClass(sharedStyles["hypership-button-primary"]);
  });
});
