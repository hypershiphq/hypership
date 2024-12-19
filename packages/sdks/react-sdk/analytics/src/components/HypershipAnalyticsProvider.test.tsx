import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HypershipAnalytics } from "./HypershipAnalytics";
import { hypershipAnalytics } from "../analytics";

// Mock the analytics module
jest.mock("../analytics", () => ({
  hypershipAnalytics: {
    initialize: jest.fn(),
    logPageView: jest.fn(),
  },
}));

// Mock the timezone data
jest.mock("../utils/timeZoneMap", () => ({
  timezoneToCountryCodeMap: {
    "America/New_York": { c: ["US"] },
    "Europe/London": { c: ["GB"] },
    "Asia/Tokyo": { c: ["JP"] },
    "Australia/Sydney": { a: "Australia/Sydney_Alias" },
    "Australia/Sydney_Alias": { c: ["AU"] },
  },
}));

describe("HypershipAnalytics", () => {
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock document properties
    Object.defineProperty(document, "title", { value: "Test Page" });
    Object.defineProperty(document, "referrer", {
      value: "https://example.com",
    });

    // Mock navigator
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 Test",
    });

    // Mock Date
    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2024-01-01T00:00:00.000Z");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes analytics with the provided API key", () => {
    render(
      <MemoryRouter>
        <HypershipAnalytics apiKey={mockApiKey} />
      </MemoryRouter>
    );

    expect(hypershipAnalytics.initialize).toHaveBeenCalledWith(mockApiKey);
  });

  it("logs page view with correct data on mount", () => {
    // Mock timezone
    jest
      .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
      .mockReturnValue({
        timeZone: "America/New_York",
      } as any);

    render(
      <MemoryRouter initialEntries={["/test-path"]}>
        <HypershipAnalytics apiKey={mockApiKey} />
      </MemoryRouter>
    );

    expect(hypershipAnalytics.logPageView).toHaveBeenCalledWith({
      currentPath: "/test-path",
      searchParams: "",
      previousPath: undefined,
      userAgent: "Mozilla/5.0 Test",
      referrer: "https://example.com",
      timestamp: "2024-01-01T00:00:00.000Z",
      title: "Test Page",
      country: "US",
    });
  });

  it("handles timezone aliases correctly", () => {
    // Mock timezone with alias
    jest
      .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
      .mockReturnValue({
        timeZone: "Australia/Sydney",
      } as any);

    render(
      <MemoryRouter>
        <HypershipAnalytics apiKey={mockApiKey} />
      </MemoryRouter>
    );

    expect(hypershipAnalytics.logPageView).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "AU",
      })
    );
  });

  it('returns "Unknown" for unrecognized timezones', () => {
    // Mock invalid timezone
    jest
      .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
      .mockReturnValue({
        timeZone: "Invalid/Timezone",
      } as any);

    render(
      <MemoryRouter>
        <HypershipAnalytics apiKey={mockApiKey} />
      </MemoryRouter>
    );

    expect(hypershipAnalytics.logPageView).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "Unknown",
      })
    );
  });
});
