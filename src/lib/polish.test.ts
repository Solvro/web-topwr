import { describe, expect, it } from "vitest";

import { DeclensionCase, GrammaticalGender, Resource } from "@/config/enums";
import { NOUN_PHRASE_TRANSFORMATIONS } from "@/config/polish";
import type { DeclinableNounPhrase } from "@/types/app";

import { declineNoun } from "./polish";

describe("Polish language utilities", () => {
  it("should decline 'organizacja studencka' correctly in genitive case", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      case: DeclensionCase.Genitive,
    });
    expect(result).toBe("organizacji studenckiej");
  });

  it("should decline 'artykuł' with determiner 'ten' correctly in nominative case", () => {
    expect(
      declineNoun(Resource.GuideArticles, {
        case: DeclensionCase.Nominative,
        prependDeterminer: "this",
      }),
    ).toBe("ten artykuł");
  });

  it("should decline 'organizacja studencka' with determiner 'nowy' correctly in dative case", () => {
    expect(
      declineNoun(Resource.StudentOrganizations, {
        case: DeclensionCase.Dative,
        prependDeterminer: "new",
      }),
    ).toBe("nowej organizacji studenckiej");
  });

  it("should decline 'baner' with determiner 'istniejący' correctly in genitive case", () => {
    expect(
      declineNoun(Resource.Banners, {
        case: DeclensionCase.Genitive,
        prependDeterminer: "existing",
      }),
    ).toBe("istniejącego baneru");
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

  it("should return all declensions for 'organizacja studencka' with determiner 'istniejący' when no case is specified", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      prependDeterminer: "existing",
    });
    expect(result).toEqual({
      gender: GrammaticalGender.Feminine,
      nominative: "istniejąca organizacja studencka",
      genitive: "istniejącej organizacji studenckiej",
      dative: "istniejącej organizacji studenckiej",
      accusative: "istniejącą organizację studencką",
      instrumental: "istniejącą organizacją studencką",
      locative: "istniejącej organizacji studenckiej",
      vocative: "istniejąca organizacjo studencka",
    });
  });

  it("should decline 'organizacje studenckie' correctly in instrumental case with plural", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      case: DeclensionCase.Instrumental,
      plural: true,
    });
    expect(result).toBe("organizacjami studenckimi");
  });

  it("should decline noun phrases correctly", () => {
    const compoundNoun: DeclinableNounPhrase = "createdAt";
    const { base, transform } = NOUN_PHRASE_TRANSFORMATIONS[compoundNoun];
    const baseDeclensions = declineNoun(base);
    const { gender, ...compoundDeclensions } = declineNoun(compoundNoun);
    for (const [key, declinedForm] of Object.entries(compoundDeclensions)) {
      const declensionCase = key as DeclensionCase;
      const baseTransformation = transform(baseDeclensions[declensionCase]);
      expect(declinedForm).toBe(baseTransformation);
    }
  });
});
