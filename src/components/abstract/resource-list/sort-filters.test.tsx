import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadonlyURLSearchParams } from "next/navigation";
import assert from "node:assert";
import { describe, expect, it, vi } from "vitest";

import {
  FORM_ERROR_MESSAGES,
  SORT_DIRECTIONS,
  SORT_FILTER_DEFAULT_VALUES,
  SORT_FILTER_LABEL_DECLENSION_CASES,
  SORT_FILTER_PLACEHOLDER,
} from "@/config/constants";
import { declineNoun } from "@/lib/polish";
import { MOCK_USE_SEARCH_PARAMS } from "@/tests/mocks/functions";
import type { SortFiltersOptions } from "@/types/components";
import type { DeclinableNoun } from "@/types/polish";

import { SortFilters } from "./sort-filters";

const SEARCH_FILTERS_OPTIONS = {
  sortBy: ["description"],
  searchField: ["description"],
} satisfies {
  sortBy: DeclinableNoun[];
  searchField: DeclinableNoun[];
};

const MOCK_SEARCH_PARAMS = {
  sortBy: "description",
  sortDirection: "desc",
  searchField: "description",
  searchTerm: "test",
} satisfies SortFiltersOptions;

function renderSortFilters() {
  const user = userEvent.setup();
  const screen = render(
    <SortFilters
      sortableFields={SEARCH_FILTERS_OPTIONS.sortBy}
      searchableFields={SEARCH_FILTERS_OPTIONS.searchField}
    />,
  );
  const input = {
    sortBy: screen.getByLabelText(/sortuj według/i),
    sortDirection: screen.getByLabelText(/w kolejności/i),
    searchField: screen.getByLabelText(/szukaj w/i),
    searchTerm: screen.getByLabelText(/wyrażenia/i),
  };
  const buttonReset = screen.getByRole("button", { name: /wyczyść filtry/i });
  const buttonSubmit = screen.getByRole("button", { name: /zatwierdź/i });

  expect(input.sortBy).toBeInTheDocument();
  expect(input.sortDirection).toBeInTheDocument();
  expect(input.searchField).toBeInTheDocument();
  expect(input.searchTerm).toBeInTheDocument();
  expect(buttonReset).toBeInTheDocument();
  expect(buttonSubmit).toBeInTheDocument();

  return {
    user,
    screen,
    input,
    buttonReset,
    buttonSubmit,
  };
}

function useMockedSearchParameters() {
  vi.mocked(MOCK_USE_SEARCH_PARAMS).mockReturnValue(
    new ReadonlyURLSearchParams(MOCK_SEARCH_PARAMS),
  );
}

function expectFormValues(
  form: ReturnType<typeof renderSortFilters>,
  values: SortFiltersOptions,
) {
  for (const key of ["sortBy", "searchField"] as const) {
    const input = form.input[key];
    const value = values[key];
    if (value === "") {
      expect(input).toHaveTextContent(SORT_FILTER_PLACEHOLDER);
    } else {
      const label = declineNoun(value, {
        case: SORT_FILTER_LABEL_DECLENSION_CASES[key],
      });
      expect(input).toHaveTextContent(label);
    }
  }

  expect(form.input.sortDirection).toHaveTextContent(
    SORT_DIRECTIONS[values.sortDirection],
  );
  expect(form.input.searchTerm).toHaveValue(values.searchTerm);
}

describe("Abstract list sort filters", () => {
  it("should render the appropriate sort filter select options", async () => {
    const form = renderSortFilters();
    await form.user.click(form.input.sortBy);
    const parent = form.input.sortBy.parentElement;
    const siblingSelect = parent?.querySelector("select");
    expect(siblingSelect).toBeInTheDocument();
    assert.ok(siblingSelect != null); // so that TS knows siblingSelect is not null, despite the previous expect
    for (const sortByOption of SEARCH_FILTERS_OPTIONS.sortBy) {
      const label = declineNoun(sortByOption, {
        case: SORT_FILTER_LABEL_DECLENSION_CASES.sortBy,
      });
      const option = within(siblingSelect).getByText(label, {
        selector: "option",
      });
      expect(option).toBeInTheDocument();
      expect(option).toHaveValue(sortByOption);
    }
  });

  it("should require search field when search term is provided", async () => {
    const form = renderSortFilters();
    await form.user.type(form.input.searchTerm, "test");
    await form.user.click(form.buttonSubmit);
    expect(
      form.screen.getByText(FORM_ERROR_MESSAGES.CONDITIONALLY_REQUIRED),
    ).toBeInTheDocument();
  });

  it("should populate initial values from search params", () => {
    useMockedSearchParameters();
    const form = renderSortFilters();
    expectFormValues(form, MOCK_SEARCH_PARAMS);
  });

  it("should reset to initial values beyond search params", async () => {
    useMockedSearchParameters();

    const form = renderSortFilters();
    await form.user.click(form.buttonReset);

    expectFormValues(form, SORT_FILTER_DEFAULT_VALUES);
  });
});
