import { describe, expect, it } from "vitest";

import type { DeclinableNoun } from "@/types/polish";

import { SortDirection } from "../enums";
import { parseSortParameter } from "./parse-sort-parameter";

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
