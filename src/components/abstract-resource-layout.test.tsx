import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AbstractResourceLayout } from "./abstract-resource-layout";

describe("Abstract Resource Layout", () => {
  const titleMap = {
    "/dashboard": "Dashboard",
    "/settings": "Settings",
    "/home": "Home",
  };

  function renderLayout(pathname: string) {
    render(
      <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
        <div>Test Content</div>
      </AbstractResourceLayout>,
    );
  }

  it("renders the correct title based on pathname", () => {
    renderLayout("/dashboard");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("shows empty title when no match is found", () => {
    renderLayout("/unknown");
    const titleElement = screen.getByRole("heading");
    expect(titleElement).toBeEmptyDOMElement();
  });
});
