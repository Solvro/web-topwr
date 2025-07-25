import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadonlyURLSearchParams } from "next/navigation";
import assert from "node:assert";
import { describe, expect, it, vi } from "vitest";

import { FORM_ERROR_MESSAGES, SORT_DIRECTIONS } from "@/config/constants";
import { isKeyOf, typedEntries } from "@/lib/helpers";
import { MOCK_USE_SEARCH_PARAMS } from "@/tests/mocks/functions";
import type { SortFiltersFormValues } from "@/types/forms";

import { SortFilters } from "./sort-filters";

const IMPLICIT_SORT_BY_ATTRIBUTES = {
  id: "identyfikatora",
  createdAt: "daty utworzenia",
  updatedAt: "daty ostatniej aktualizacji",
} as const;

const MOCK_RESOURCE_ATTRIBUTE_LABELS = {
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
  sortDirection: SORT_DIRECTIONS,
} satisfies {
  [key in keyof SortFiltersFormValues]?: Record<string, string>;
};

type MockedSortFilterAttribute = keyof typeof MOCK_RESOURCE_ATTRIBUTE_LABELS;

const OPTIONAL_ATTRIBUTE_PLACEHOLDERS = {
  searchField: "wybierz pole",
} satisfies Partial<Record<MockedSortFilterAttribute, string>>;
type OptionalAttributes = keyof typeof OPTIONAL_ATTRIBUTE_PLACEHOLDERS;

type MockedAttribute<K extends MockedSortFilterAttribute> =
  keyof (typeof MOCK_RESOURCE_ATTRIBUTE_LABELS)[K];

type MockedSortFiltersFormValues = SortFiltersFormValues & {
  [key in MockedSortFilterAttribute]: key extends OptionalAttributes
    ? MockedAttribute<key> | (typeof OPTIONAL_ATTRIBUTE_PLACEHOLDERS)[key]
    : MockedAttribute<key>;
};

const MOCK_SEARCH_PARAMS = {
  sortBy: "createdAt",
  sortDirection: "desc",
  searchField: "length",
} satisfies Partial<MockedSortFiltersFormValues>;

function renderSortFilters() {
  const user = userEvent.setup();
  const screen = render(
    <SortFilters
      sortFields={MOCK_RESOURCE_ATTRIBUTE_LABELS.sortBy}
      searchFields={MOCK_RESOURCE_ATTRIBUTE_LABELS.searchField}
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
  values: MockedSortFiltersFormValues,
) {
  const { searchTerm, ...restValues } = values;
  for (const [key, value] of typedEntries(restValues)) {
    const input = form.input[key];
    const labels = MOCK_RESOURCE_ATTRIBUTE_LABELS[key];
    const expectedValue = isKeyOf(value, labels)
      ? labels[value]
      : isKeyOf(key, OPTIONAL_ATTRIBUTE_PLACEHOLDERS)
        ? OPTIONAL_ATTRIBUTE_PLACEHOLDERS[key]
        : value;
    expect(input).toHaveTextContent(expectedValue);
  }
  expect(form.input.searchTerm).toHaveValue(searchTerm);
}

describe("Abstract list sort filters", () => {
  it("should render the appropriate sort filter select options", async () => {
    const form = renderSortFilters();
    await form.user.click(form.input.sortBy);
    const parent = form.input.sortBy.parentElement;
    const siblingSelect = parent?.querySelector("select");
    expect(siblingSelect).toBeInTheDocument();
    assert.ok(siblingSelect != null); // so that TS knows siblingSelect is not null, despite the previous expect
    for (const [key, value] of Object.entries(
      MOCK_RESOURCE_ATTRIBUTE_LABELS.sortBy,
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
    await form.user.type(form.input.searchTerm, "test");
    await form.user.click(form.buttonSubmit);
    expect(
      form.screen.getByText(FORM_ERROR_MESSAGES.CONDITIONALLY_REQUIRED),
    ).toBeInTheDocument();
  });

  it("should populate initial values from search params", () => {
    useMockedSearchParameters();
    const form = renderSortFilters();
    expectFormValues(form, { ...MOCK_SEARCH_PARAMS, searchTerm: "" });
  });

  it("should reset to initial values beyond search params", async () => {
    useMockedSearchParameters();

    const form = renderSortFilters();
    await form.user.click(form.buttonReset);

    expectFormValues(form, {
      ...OPTIONAL_ATTRIBUTE_PLACEHOLDERS,
      sortBy: "id",
      sortDirection: "asc",
      searchTerm: "",
    });
  });
});
