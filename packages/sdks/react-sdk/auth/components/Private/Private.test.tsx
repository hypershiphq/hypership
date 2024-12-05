import { render, screen } from "@testing-library/react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import Private from "./Private";

jest.mock("axios");
jest.mock("../../hooks/useHypershipAuth");
jest.mock("../../utils/apiClient", () => ({
  interceptors: { response: { use: jest.fn() } },
}));

describe("Private Component", () => {
  const mockOnUnauthorized = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children if user is authenticated", () => {
    // Mock the isAuthenticated value to be true
    (useHypershipAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    render(
      <Private onUnauthorized={mockOnUnauthorized}>
        <div>Authenticated Content</div>
      </Private>
    );

    // Check that the children content is displayed
    expect(screen.getByText("Authenticated Content")).toBeInTheDocument();
    expect(mockOnUnauthorized).not.toHaveBeenCalled();
  });

  test("does not render children and calls onUnauthorized if user is not authenticated", () => {
    // Mock the isAuthenticated value to be false
    (useHypershipAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <Private onUnauthorized={mockOnUnauthorized}>
        <div>Authenticated Content</div>
      </Private>
    );

    // Check that the children content is not displayed
    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
    // Verify that onUnauthorized is called when user is not authenticated
    expect(mockOnUnauthorized).toHaveBeenCalledTimes(1);
  });

  test("does not call onUnauthorized if onUnauthorized is not provided and user is not authenticated", () => {
    // Mock the isAuthenticated value to be false
    (useHypershipAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <Private onUnauthorized={undefined}>
        <div>Authenticated Content</div>
      </Private>
    );

    // Check that the children content is not displayed
    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
    // onUnauthorized should not be called if it's not provided
    expect(mockOnUnauthorized).not.toHaveBeenCalled();
  });
});
