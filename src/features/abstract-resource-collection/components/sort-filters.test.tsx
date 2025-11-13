import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import assert from "node:assert/strict";
import { describe, expect, it } from "vitest";

import { declineNoun } from "@/features/polish";
import type { DeclinableNoun } from "@/features/polish/types";
import { isEmptyValue } from "@/utils";

import { IMPLICIT_SORTABLE_FIELDS } from "../data/implicit-sortable-fields";
import { SORT_DIRECTION_NAMES } from "../data/sort-direction-names";
import { SORT_FILTER_DEFAULT_VALUES } from "../data/sort-filter-default-values";
import { SORT_FILTER_LABEL_DECLENSION_CASES } from "../data/sort-filter-label-declension-cases";
import { SORT_FILTER_PLACEHOLDER } from "../data/sort-filter-placeholder";
import { FilterType, SortDirection } from "../enums";
import type { SortFiltersFormValuesNarrowed } from "../types/sort-filters";
import { SortFilters } from "./sort-filters";

const MOCK_SORTABLE_FIELDS = ["description"] satisfies DeclinableNoun[];

const MOCK_FORM_VALUES = {
  sortBy: "description",
  sortDirection: SortDirection.Descending,
  filters: [
    {
      field: "description",
      value: "test",
    },
  ],
} satisfies SortFiltersFormValuesNarrowed;

function renderSortFilters(defaultValues?: SortFiltersFormValuesNarrowed) {
  const user = userEvent.setup();
  const screen = render(
    <SortFilters
      sortableFields={MOCK_SORTABLE_FIELDS}
      filterDefinitions={{
        description: { type: FilterType.Text, label: "Opis" },
      }}
      defaultValues={defaultValues}
    />,
  );
  const input = {
    sortBy: screen.getByLabelText(/sortuj według/i),
    sortDirection: screen.getByLabelText(/w kolejności/i),
    addFilter: screen.getByRole("button", { name: /dodaj filtr/i }),
  };
  const buttonReset = screen.getByRole("button", { name: /wyczyść filtry/i });
  const buttonSubmit = screen.getByRole("button", { name: /zatwierdź/i });

  expect(input.sortBy).toBeInTheDocument();
  expect(input.sortDirection).toBeInTheDocument();
  expect(input.addFilter).toBeInTheDocument();
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

function expectFormValues(
  form: ReturnType<typeof renderSortFilters>,
  values: SortFiltersFormValuesNarrowed,
) {
  const input = form.input.sortBy;
  const value = values.sortBy;
  if (isEmptyValue(value)) {
    expect(input).toHaveTextContent(SORT_FILTER_PLACEHOLDER);
  } else {
    const label = declineNoun(value, {
      case: SORT_FILTER_LABEL_DECLENSION_CASES.sortBy,
    });
    expect(input).toHaveTextContent(label);
  }

  expect(form.input.sortDirection).toHaveTextContent(
    SORT_DIRECTION_NAMES[values.sortDirection],
  );
  // TODO: check filters
}

describe("Abstract list sort filters", () => {
  it("should render the appropriate sort filter select options", async () => {
    const form = renderSortFilters();
    await form.user.click(form.input.sortBy);
    const parent = form.input.sortBy.parentElement;
    const siblingSelect = parent?.querySelector("select");
    expect(siblingSelect).toBeInTheDocument();
    assert.ok(siblingSelect != null); // so that TS knows siblingSelect is not null, despite the previous expect
    for (const sortByOption of [
      ...MOCK_SORTABLE_FIELDS,
      ...IMPLICIT_SORTABLE_FIELDS,
    ]) {
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

  it("should populate initial values from search params", () => {
    const form = renderSortFilters(MOCK_FORM_VALUES);
    expectFormValues(form, MOCK_FORM_VALUES);
  });

  it("should reset to initial values beyond search params", async () => {
    const form = renderSortFilters(MOCK_FORM_VALUES);
    await form.user.click(form.buttonReset);

    expectFormValues(form, SORT_FILTER_DEFAULT_VALUES);
  });
});
