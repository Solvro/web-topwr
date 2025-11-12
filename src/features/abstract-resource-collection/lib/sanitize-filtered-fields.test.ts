import { describe, expect, it } from "vitest";

import { FilterType } from "../data/filter-type";
import type { FilterDefinitions, FilteredField } from "../types/internal";
import { sanitizeFilteredFields } from "./sanitize-filtered-fields";

describe("sanitizeFilteredFields function", () => {
  it("should sanitize filtered fields correctly", () => {
    const filteredFields: FilteredField[] = [
      { field: "name", value: "Test Name" },
      { field: "status", value: "active" },
      { field: "invalidField", value: "shouldBeIgnored" },
    ];
    const filterDefinitions: FilterDefinitions = {
      name: { type: FilterType.Text, label: "Name" },
      status: {
        type: FilterType.Select,
        label: "Status",
        optionEnum: {},
        optionLabels: {},
      },
    };
    const expectedFilters = "name=%25Test+Name%25&status=active";

    const obtainedFilters = sanitizeFilteredFields(
      filterDefinitions,
      filteredFields,
    );
    expect(obtainedFilters.toString()).toEqual(expectedFilters);
  });
});
