import React from "react";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  test("renders success alert with correct message and styling", () => {
    render(<Alert message="Operation successful!" type="success" />);

    const alert = screen.getByText("Operation successful!");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass(sharedStyles["hypership-success-message"]);
  });

  test("renders error alert with correct message and styling", () => {
    render(<Alert message="An error occurred." type="error" />);

    const alert = screen.getByText("An error occurred.");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass(sharedStyles["hypership-error-message"]);
  });

  test("applies no styling when unstyled prop is true", () => {
    render(<Alert message="Unstyled message." type="error" unstyled />);

    const alert = screen.getByText("Unstyled message.");
    expect(alert).toBeInTheDocument();
    expect(alert).not.toHaveClass(sharedStyles["hypership-error-message"]);
    expect(alert).not.toHaveClass(sharedStyles["hypership-success-message"]);
  });

  test("does not render anything when message is null", () => {
    const { container } = render(<Alert message={null} type="error" />);
    expect(container).toBeEmptyDOMElement();
  });
});
