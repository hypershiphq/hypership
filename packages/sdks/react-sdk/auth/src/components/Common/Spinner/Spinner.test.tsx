import React from "react";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";
import * as sharedStyles from "../../AuthComponents.module.css";;

describe("Spinner Component", () => {
  test("renders spinner with default size", () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector(
      `.${sharedStyles["hypership-spinner"]}`
    );
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({ width: "22px", height: "22px" });
  });

  test("renders spinner with custom size", () => {
    const { container } = render(<Spinner size={40} />);

    const spinner = container.querySelector(
      `.${sharedStyles["hypership-spinner"]}`
    );
    expect(spinner).toHaveStyle({ width: "40px", height: "40px" });
  });
});
