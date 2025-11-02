import { describe, expect, it } from "vitest";

import { FilterType, Resource } from "@/config/enums";
import type { FilterDefinitions } from "@/types/components";

import { getResourceFilterDefinitions } from "./filter-definitions";

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
    const filterDefinitions = await getResourceFilterDefinitions(
      Resource.Banners,
    );
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
