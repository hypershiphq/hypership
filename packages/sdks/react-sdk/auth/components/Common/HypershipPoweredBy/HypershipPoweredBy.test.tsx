import React from "react";
import { render, screen } from "@testing-library/react";
import HypershipPoweredBy from "./HypershipPoweredBy";
import sharedStyles from "../../AuthComponents.module.css";

describe("HypershipPoweredBy Component", () => {
  test("renders powered by text and link", () => {
    render(<HypershipPoweredBy />);

    const poweredByElement = screen.getByText("Powered by");
    expect(poweredByElement).toHaveClass(sharedStyles["hypership-powered-by"]);

    const linkElement = screen.getByRole("link", {
      name: /Hypership Logo Hypership/i,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://hypership.dev");
    expect(linkElement).toHaveClass(sharedStyles["hypership-link"]);

    const logo = screen.getByAltText("Hypership Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://hypership.dev/logo.svg");
    expect(logo).toHaveClass(sharedStyles["hypership-logo"]);
  });
});
