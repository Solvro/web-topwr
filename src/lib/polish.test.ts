import { describe, expect, it } from "vitest";

import { DeclensionCase, GrammaticalGender, Resource } from "@/config/enums";

import { declineNoun } from "./polish";

describe("Polish language utilities", () => {
  it("should decline 'organizacja studencka' correctly in genitive case", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      case: DeclensionCase.Genitive,
    });
    expect(result).toBe("organizacji studenckiej");
  });

  it("should decline 'artykuł' correctly in nominative case with determiner", () => {
    const result = declineNoun(Resource.GuideArticles, {
      case: DeclensionCase.Nominative,
      prependDeterminer: true,
    });
    expect(result).toBe("ten artykuł");
  });

  it("should return all declensions for 'artykuł' when no case is specified", () => {
    const result = declineNoun(Resource.GuideArticles);
    expect(result).toEqual({
      gender: GrammaticalGender.Masculine,
      nominative: "artykuł",
      genitive: "artykułu",
      dative: "artykułowi",
      accusative: "artykuł",
      instrumental: "artykułem",
      locative: "artykule",
      vocative: "artykule",
    });
  });

  it("should decline 'organizacje studenckie' correctly in instrumental case with plural", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      case: DeclensionCase.Instrumental,
      plural: true,
    });
    expect(result).toBe("organizacjami studenckimi");
  });
});
