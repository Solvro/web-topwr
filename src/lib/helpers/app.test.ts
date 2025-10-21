import { describe, expect, it } from "vitest";

import { Resource } from "@/config/enums";

import { getRecursiveRelations } from "./app";

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
