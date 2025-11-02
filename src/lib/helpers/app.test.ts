import { describe, expect, it } from "vitest";

import { FilterType, Resource, SortDirection } from "@/config/enums";
import type { FilterDefinitions } from "@/types/components";
import type { SortFiltersFormValues } from "@/types/forms";

import {
  getRecursiveRelations,
  getSearchParametersFromSortFilters,
  parseFilterSearchParameters,
} from "./app";

describe("getRecursiveRelations function", () => {
  it("should return an empty array for resources with no relations", () => {
    expect(getRecursiveRelations(Resource.Roles)).toEqual([]);
    expect(getRecursiveRelations(Resource.Banners)).toEqual([]);
  });

  it("should work for non-recursive relations", () => {
    expect(getRecursiveRelations(Resource.StudentOrganizations)).toEqual([
      "links",
      "tags",
    ]);
    expect(getRecursiveRelations(Resource.GuideArticles)).toEqual([
      "guideQuestions",
      "guideAuthors",
    ]);
  });

  it("should work for recursive relations", () => {
    expect(getRecursiveRelations(Resource.Milestones)).toEqual([
      "contributors",
      "contributors.socialLinks",
    ]);
    expect(getRecursiveRelations(Resource.Versions)).toEqual([
      "changes",
      "milestones",
      "milestones.contributors",
      "milestones.contributors.socialLinks",
    ]);
  });
});

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
    const sortFiltersFormValues: SortFiltersFormValues = {
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
