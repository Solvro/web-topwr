import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Resource } from "@/config/enums";
import { MOCK_USE_PATHNAME } from "@/tests/unit";

import { AbstractResourceLayoutInternal } from "./internal";

describe("Abstract Resource Layout", () => {
  function renderLayout(pathname: string) {
    MOCK_USE_PATHNAME.mockReturnValueOnce(pathname);
    render(
      <AbstractResourceLayoutInternal resource={Resource.StudentOrganizations}>
        <div>Test Content</div>
      </AbstractResourceLayoutInternal>,
    );
  }

  it("renders the correct title based on pathname", () => {
    renderLayout("/student_organizations");
    expect(screen.getByText("Zarządzanie organizacjami")).toBeInTheDocument();
  });

  it("shows empty title when no match is found", () => {
    renderLayout("/unknown");
    expect(screen.getByRole("heading")).toHaveTextContent(/^$/);
  });
});
