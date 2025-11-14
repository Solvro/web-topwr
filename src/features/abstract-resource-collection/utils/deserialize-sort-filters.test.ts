import { describe, expect, it } from "vitest";

import { FilterType } from "../enums";
import type { FilterDefinitions } from "../types/sort-filters";
import { deserializeSortFilters } from "./deserialize-sort-filters";

describe("deserializeSortFilters function", () => {
  it("should parse filters correctly", () => {
    const searchParameters = {
      name: "Test Name",
      status: "active",
      irrelevantParam: "shouldBeIgnored",
    };
    const filterDefinitions: FilterDefinitions = {
      name: { type: FilterType.Text, label: "Name" },
      status: {
        type: FilterType.Select,
        label: "Status",
        optionEnum: {},
        optionLabels: {},
      },
    };
    const expectedFilters = [
      { field: "name", value: "Test Name" },
      { field: "status", value: "active" },
    ];
    expect(deserializeSortFilters(searchParameters, filterDefinitions)).toEqual(
      expectedFilters,
    );
  });
});
