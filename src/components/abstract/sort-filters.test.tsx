import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadonlyURLSearchParams } from "next/navigation";
import assert from "node:assert";
import { describe, expect, it, vi } from "vitest";

import { FORM_ERROR_MESSAGES, SORT_DIRECTIONS } from "@/config/constants";
import { MOCK_USE_SEARCH_PARAMS } from "@/tests/mocks/functions";
import type { SortFiltersFormValues } from "@/types/forms";

import { SortFilters } from "./sort-filters";

const IMPLICIT_SORT_BY_ATTRIBUTES = {
  id: "identyfikatora",
  createdAt: "daty utworzenia",
  updatedAt: "daty ostatniej aktualizacji",
} as const;

const MOCK_RESOURCE_ATTRIBUTES = {
  sortBy: {
    width: "szerokości",
    height: "wysokości",
    length: "długości",
    weight: "wagi",
    ...IMPLICIT_SORT_BY_ATTRIBUTES,
  },
  searchField: {
    width: "szerokości",
    height: "wysokości",
    length: "długości",
    weight: "wadze",
  },
} satisfies {
  [key in keyof SortFiltersFormValues]?: Record<string, string>;
};

const MOCK_SEARCH_PARAMS = {
  sortBy: "createdAt",
  sortDirection: "desc",
  searchField: "length",
} satisfies Partial<
  SortFiltersFormValues & {
    [key in keyof typeof MOCK_RESOURCE_ATTRIBUTES]: keyof (typeof MOCK_RESOURCE_ATTRIBUTES)[key];
  }
>;

function renderSortFilters() {
  const user = userEvent.setup();
  const screen = render(
    <SortFilters
      sortFields={MOCK_RESOURCE_ATTRIBUTES.sortBy}
      searchFields={MOCK_RESOURCE_ATTRIBUTES.searchField}
    />,
  );
  const comboboxSortBy = screen.getByLabelText(/sortuj według/i);
  const comboboxSortDirection = screen.getByLabelText(/w kolejności/i);
  const comboboxSearchField = screen.getByLabelText(/szukaj w/i);
  const inputSearchTerm = screen.getByLabelText(/wyrażenia/i);
  const buttonSubmit = screen.getByRole("button", { name: /zatwierdź/i });

  expect(comboboxSortBy).toBeInTheDocument();
  expect(comboboxSortDirection).toBeInTheDocument();
  expect(comboboxSearchField).toBeInTheDocument();
  expect(inputSearchTerm).toBeInTheDocument();
  expect(buttonSubmit).toBeInTheDocument();

  return {
    user,
    screen,
    comboboxSortBy,
    comboboxSortDirection,
    comboboxSearchField,
    inputSearchTerm,
    buttonSubmit,
  };
}

describe("Abstract list sort filters", () => {
  it("should render the appropriate sort filter select options", async () => {
    const form = renderSortFilters();
    await form.user.click(form.comboboxSortBy);
    const parent = form.comboboxSortBy.parentElement;
    const siblingSelect = parent?.querySelector("select");
    expect(siblingSelect).toBeInTheDocument();
    assert.ok(siblingSelect != null); // so that TS knows siblingSelect is not null, despite the previous expect
    for (const [key, value] of Object.entries(
      MOCK_RESOURCE_ATTRIBUTES.sortBy,
    )) {
      const option = within(siblingSelect).getByText(value, {
        selector: "option",
      });
      expect(option).toBeInTheDocument();
      expect(option.getAttribute("value")).toBe(key);
    }
  });

  it("should require search field when search term is provided", async () => {
    const form = renderSortFilters();
    await form.user.type(form.inputSearchTerm, "test");
    await form.user.click(form.buttonSubmit);
    expect(
      form.screen.getByText(FORM_ERROR_MESSAGES.CONDITIONALLY_REQUIRED),
    ).toBeInTheDocument();
  });

  it("should populate initial values from search params", () => {
    vi.mocked(MOCK_USE_SEARCH_PARAMS).mockReturnValue(
      new ReadonlyURLSearchParams(MOCK_SEARCH_PARAMS),
    );

    const form = renderSortFilters();
    expect(form.comboboxSortBy).toHaveTextContent(
      MOCK_RESOURCE_ATTRIBUTES.sortBy[MOCK_SEARCH_PARAMS.sortBy],
    );
    expect(form.comboboxSortDirection).toHaveTextContent(
      SORT_DIRECTIONS[MOCK_SEARCH_PARAMS.sortDirection],
    );
    expect(form.comboboxSearchField).toHaveTextContent(
      MOCK_RESOURCE_ATTRIBUTES.searchField[MOCK_SEARCH_PARAMS.searchField],
    );
    expect(form.inputSearchTerm).toHaveValue("");
  });
});
