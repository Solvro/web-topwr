import { describe, expect, it } from "vitest";

import { FilterType, SortDirection } from "@/config/enums";
import type { FilterDefinitions } from "@/types/components";
import type {
  FilteredField,
  SortFiltersFormValuesNarrowed,
} from "@/types/forms";
import type { DeclinableNoun } from "@/types/polish";

import {
  getSearchParametersFromSortFilters,
  parseFilterSearchParameters,
  parseSortParameter,
  sanitizeFilteredFields,
} from "./sort-filters";

describe("parseFilterSearchParameters function", () => {
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
    expect(
      parseFilterSearchParameters(searchParameters, filterDefinitions),
    ).toEqual(expectedFilters);
  });
});

describe("getSearchParametersFromSortFilters function", () => {
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
    const obtainedParameters = getSearchParametersFromSortFilters(
      sortFiltersFormValues,
    );
    expect(obtainedParameters.toString()).toEqual(expectedSearchParameters);
  });
});

describe("parseSortParameter function", () => {
  it("should parse sort search parameters correctly", () => {
    expect(parseSortParameter("asc.name")).toEqual({
      sortDirection: SortDirection.Ascending,
      sortBy: "name",
    });
    expect(parseSortParameter("desc.createdAt")).toEqual({
      sortDirection: SortDirection.Descending,
      sortBy: "createdAt",
    });
  });

  it("should return null for invalid sort parameters", () => {
    expect(parseSortParameter("invalidFormat")).toBeNull();
    expect(parseSortParameter("asc.")).toBeNull();
    expect(parseSortParameter(".name")).toBeNull();
    expect(parseSortParameter("ascending.name")).toBeNull();
  });

  it("should only allow sortable fields if provided", () => {
    const sortableFields = ["name", "createdAt"] satisfies DeclinableNoun[];
    expect(parseSortParameter("asc.name", sortableFields)).toEqual({
      sortDirection: SortDirection.Ascending,
      sortBy: "name",
    });
    expect(parseSortParameter("desc.createdAt", sortableFields)).toEqual({
      sortDirection: SortDirection.Descending,
      sortBy: "createdAt",
    });
    expect(parseSortParameter("asc.invalidField", sortableFields)).toBeNull();
  });
});

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
