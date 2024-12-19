import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { EventsProvider, useEvents } from "./EventsProvider";
import { apiRequest } from "../utils/apiClient";
import { validateConfig } from "../utils/validateConfig";

// Mock the dependencies
jest.mock("../utils/apiClient");
jest.mock("../utils/validateConfig");

// Test component that uses the context
const TestComponent = () => {
  const { trackEvent } = useEvents();

  const handleClick = () => {
    trackEvent("test_event", { foo: "bar" });
  };

  return <button onClick={handleClick}>Track Event</button>;
};

describe("EventsProvider", () => {
  const mockPublicKey = "test-public-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("validates the config on mount", () => {
    render(
      <EventsProvider publicKey={mockPublicKey}>
        <div>Test</div>
      </EventsProvider>
    );

    expect(validateConfig).toHaveBeenCalledWith(mockPublicKey);
  });

  it("provides trackEvent function through context", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({});

    render(
      <EventsProvider publicKey={mockPublicKey}>
        <TestComponent />
      </EventsProvider>
    );

    const button = screen.getByText("Track Event");
    button.click();

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "hs-public-key": mockPublicKey,
        },
        body: JSON.stringify({
          eventKey: "test_event",
          metadata: { foo: "bar" },
        }),
      });
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (apiRequest as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(
      <EventsProvider publicKey={mockPublicKey}>
        <TestComponent />
      </EventsProvider>
    );

    const button = screen.getByText("Track Event");
    button.click();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error logging event:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("throws error when useEvents is used outside of EventsProvider", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      "Hypership useEvents must be used within a HypershipEventsProvider"
    );

    consoleErrorSpy.mockRestore();
  });
});
