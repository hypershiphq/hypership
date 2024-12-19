import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConfirmUserAccount } from "./ConfirmUserAccount";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

jest.mock("../../hooks/useHypershipAuth");

jest.mock("../../utils/apiClient", () => ({
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
}));

describe("ConfirmUserAccount Component", () => {
  const mockConfirmAccount = jest.fn();
  const mockOnConfirmationSuccess = jest.fn();

  beforeEach(() => {
    (useHypershipAuth as jest.Mock).mockReturnValue({
      confirmAccount: mockConfirmAccount,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ConfirmUserAccount form with email and OTP input", () => {
    render(
      <ConfirmUserAccount onConfirmationSuccess={mockOnConfirmationSuccess} />
    );

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();

    // Check that all six OTP input fields are present by targeting their aria-labels
    for (let i = 1; i <= 6; i++) {
      expect(
        screen.getByLabelText(`Please enter OTP character ${i}`)
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", { name: /Confirm Account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Resend confirmation code/i })
    ).toBeInTheDocument();
  });

  test("shows error if email is missing on submit", async () => {
    render(
      <ConfirmUserAccount onConfirmationSuccess={mockOnConfirmationSuccess} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Confirm Account/i }));

    expect(
      screen.getByText("Please enter your email address.")
    ).toBeInTheDocument();
  });

  test("shows error if OTP length is not 6 digits", async () => {
    render(
      <ConfirmUserAccount
        onConfirmationSuccess={mockOnConfirmationSuccess}
        email="test@example.com"
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });

    // Simulate entering a 3-digit OTP instead of a 6-digit OTP
    fireEvent.change(screen.getByLabelText("Please enter OTP character 1"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 2"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 3"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 4"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 5"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirm Account/i }));

    // Assert that the correct error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Please enter a 6-digit code.")
      ).toBeInTheDocument();
    });
  });

  test("calls confirmAccount with correct values and triggers onConfirmationSuccess after successful confirmation", async () => {
    mockConfirmAccount.mockResolvedValueOnce({});
    render(
      <ConfirmUserAccount
        onConfirmationSuccess={mockOnConfirmationSuccess}
        email="test@example.com"
      />
    );
    // Simulate entering a 3-digit OTP instead of a 6-digit OTP
    fireEvent.change(screen.getByLabelText("Please enter OTP character 1"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 2"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 3"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 4"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 6"), {
      target: { value: "6" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm Account/i }));

    await waitFor(() =>
      expect(mockConfirmAccount).toHaveBeenCalledWith(
        "test@example.com",
        "123456"
      )
    );
    await waitFor(() => expect(mockOnConfirmationSuccess).toHaveBeenCalled());
  });

  test("displays error message if confirmAccount fails", async () => {
    const errorMessage = "Invalid confirmation code.";
    (useHypershipAuth as jest.Mock).mockReturnValue({
      confirmAccount: jest.fn().mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      }),
      error: errorMessage,
    });

    render(
      <ConfirmUserAccount
        onConfirmationSuccess={mockOnConfirmationSuccess}
        email="test@example.com"
      />
    );

    // Simulate entering the 6-digit OTP
    fireEvent.change(screen.getByLabelText("Please enter OTP character 1"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 2"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 3"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 4"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Please enter OTP character 6"), {
      target: { value: "6" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirm Account/i }));

    // Verify that the error message appears
    await screen.findByText(errorMessage);
  });

  test("does not apply styling when unstyled is true", () => {
    render(
      <ConfirmUserAccount
        onConfirmationSuccess={mockOnConfirmationSuccess}
        unstyled={true}
      />
    );

    expect(screen.queryByTestId("hypership-container")).not.toBeInTheDocument();
  });
});
