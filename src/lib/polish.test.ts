import { describe, expect, it } from "vitest";

import { GrammaticalCase, GrammaticalGender, Resource } from "@/config/enums";
import { NOUN_PHRASE_TRANSFORMATIONS } from "@/config/polish";
import type { DeclinableNounPhrase } from "@/types/polish";

import { typedEntries } from "./helpers";
import { declineNoun } from "./polish";

describe("Polish language utilities", () => {
  it("should decline 'organizacja studencka' correctly in genitive case", () => {
    const result = declineNoun(Resource.StudentOrganizations, {
      case: GrammaticalCase.Genitive,
    });
    expect(result).toBe("organizacji studenckiej");
  });

  it("should decline 'artykuł' with determiner 'ten' correctly in nominative case", () => {
    expect(
      declineNoun(Resource.GuideArticles, {
        case: GrammaticalCase.Nominative,
        prependDeterminer: "this",
      }),
    ).toBe("ten artykuł");
  });

  it("should decline 'organizacja studencka' with determiner 'nowy' correctly in dative case", () => {
    expect(
      declineNoun(Resource.StudentOrganizations, {
        case: GrammaticalCase.Dative,
        prependDeterminer: "new",
      }),
    ).toBe("nowej organizacji studenckiej");
  });

  it("should decline 'baner' with determiner 'istniejący' correctly in genitive case", () => {
    expect(
      declineNoun(Resource.Banners, {
        case: GrammaticalCase.Genitive,
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
      case: GrammaticalCase.Instrumental,
      plural: true,
    });
    expect(result).toBe("organizacjami studenckimi");
  });

  it("should decline noun phrases correctly", () => {
    const compoundNoun: DeclinableNounPhrase = "createdAt";
    const { base, transform } = NOUN_PHRASE_TRANSFORMATIONS[compoundNoun];
    const baseDeclensions = declineNoun(base);
    const { gender, ...compoundDeclensions } = declineNoun(compoundNoun);
    for (const [case_, declinedForm] of typedEntries(compoundDeclensions)) {
      const baseTransformation = transform(baseDeclensions[case_]);
      expect(declinedForm).toBe(baseTransformation);
    }
  });

  it("should handle singular animate masculine nouns correctly in accusative case", () => {
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "this",
      }),
    ).toBe("tego autora");
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "new",
      }),
    ).toBe("nowego autora");
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "existing",
      }),
    ).toBe("istniejącego autora");
  });

  it("should handle singular inanimate masculine nouns correctly in accusative case", () => {
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "this",
      }),
    ).toBe("ten tag");
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "new",
      }),
    ).toBe("nowy tag");
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        prependDeterminer: "existing",
      }),
    ).toBe("istniejący tag");
  });

  it("should handle plural masculine nouns correctly in accusative case", () => {
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "this",
      }),
    ).toBe("tych autorów");
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "new",
      }),
    ).toBe("nowych autorów");
    expect(
      declineNoun(Resource.GuideAuthors, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "existing",
      }),
    ).toBe("istniejących autorów");
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "this",
      }),
    ).toBe("te tagi");
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "new",
      }),
    ).toBe("nowe tagi");
    expect(
      declineNoun(Resource.StudentOrganizationTags, {
        case: GrammaticalCase.Accusative,
        plural: true,
        prependDeterminer: "existing",
      }),
    ).toBe("istniejące tagi");
  });
});
