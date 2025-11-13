import { describe, expect, it } from "vitest";

import { Resource } from "@/features/resources";

import { FilterType } from "../enums";
import type { FilterDefinitions } from "../types/sort-filters";
import { getResourceFilterDefinitions } from "./get-resource-filter-definitions";

const expectFieldTypes = (
  filterDefinitions: FilterDefinitions,
  expectedType: FilterType,
  fields: string[],
) => {
  for (const field of fields) {
    expect(filterDefinitions).toHaveProperty(field);
    expect(filterDefinitions[field]).toHaveProperty("type");
    expect(filterDefinitions[field].type).toBe(expectedType);
  }
};

describe("getFilterDefinitions function", () => {
  it("should return the correct filter definitions for banners", async () => {
    const filterDefinitions = await getResourceFilterDefinitions({
      resource: Resource.Banners,
    });
    expect(filterDefinitions).toBeDefined();
    expect(Object.keys(filterDefinitions)).toHaveLength(9);
    expectFieldTypes(filterDefinitions, FilterType.Text, [
      "title",
      "description",
      "url",
      "textColor",
      "backgroundColor",
      "titleColor",
      "visibleFrom",
      "visibleUntil",
    ]);
    expectFieldTypes(filterDefinitions, FilterType.Checkbox, ["draft"]);
  });
});
