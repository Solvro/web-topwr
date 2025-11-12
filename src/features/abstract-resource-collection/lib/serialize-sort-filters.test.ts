import { describe, expect, it } from "vitest";

import { SortDirection } from "../data/sort-direction";
import type { SortFiltersFormValuesNarrowed } from "../types/internal";
import { serializeSortFilters } from "./serialize-sort-filters";

describe("serializeSortFilters function", () => {
  it("should convert sort filter values into search parameters", () => {
    const sortFiltersFormValues: SortFiltersFormValuesNarrowed = {
      sortBy: "name",
      sortDirection: SortDirection.Ascending,
      filters: [
        { field: "status", value: "active" },
        { field: "category", value: "general" },
      ],
    };
    const expectedSearchParameters =
      "sort=asc.name&status=active&category=general";
    const obtainedParameters = serializeSortFilters(sortFiltersFormValues);
    expect(obtainedParameters.toString()).toEqual(expectedSearchParameters);
  });
});
