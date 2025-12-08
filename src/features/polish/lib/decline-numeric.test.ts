import { describe, expect, it } from "vitest";

import { Resource } from "@/features/resources/enums";

import { GrammaticalCase } from "../enums";
import { declineNumeric } from "./decline-numeric";

describe("declineNumeric function", () => {
  describe("with DeclinableNoun overload", () => {
    describe("simple nouns", () => {
      it("should decline feminine noun 'category' correctly", () => {
        // category: kategorię (acc sg), kategorie (nom pl), kategorii (gen pl)
        expect(declineNumeric(0, "category")).toBe("0 kategorii");
        expect(declineNumeric(1, "category")).toBe("1 kategorię");
        expect(declineNumeric(2, "category")).toBe("2 kategorie");
        expect(declineNumeric(3, "category")).toBe("3 kategorie");
        expect(declineNumeric(4, "category")).toBe("4 kategorie");
        expect(declineNumeric(5, "category")).toBe("5 kategorii");
        expect(declineNumeric(11, "category")).toBe("11 kategorii");
        expect(declineNumeric(12, "category")).toBe("12 kategorii");
        expect(declineNumeric(13, "category")).toBe("13 kategorii");
        expect(declineNumeric(14, "category")).toBe("14 kategorii");
        expect(declineNumeric(15, "category")).toBe("15 kategorii");
        expect(declineNumeric(21, "category")).toBe("21 kategorii");
        expect(declineNumeric(22, "category")).toBe("22 kategorie");
        expect(declineNumeric(100, "category")).toBe("100 kategorii");
      });

      it("should decline feminine noun 'Changes' (Resource) correctly", () => {
        // zmiana: zmianę (acc sg), zmiany (nom pl), zmian (gen pl)
        expect(declineNumeric(0, Resource.Changes)).toBe("0 zmian");
        expect(declineNumeric(1, Resource.Changes)).toBe("1 zmianę");
        expect(declineNumeric(2, Resource.Changes)).toBe("2 zmiany");
        expect(declineNumeric(5, Resource.Changes)).toBe("5 zmian");
        expect(declineNumeric(12, Resource.Changes)).toBe("12 zmian");
        expect(declineNumeric(22, Resource.Changes)).toBe("22 zmiany");
      });

      it("should decline masculine noun 'Banners' correctly", () => {
        // baner: baner (acc sg), banery (nom pl), banerów (gen pl)
        expect(declineNumeric(0, Resource.Banners)).toBe("0 banerów");
        expect(declineNumeric(1, Resource.Banners)).toBe("1 baner");
        expect(declineNumeric(2, Resource.Banners)).toBe("2 banery");
        expect(declineNumeric(5, Resource.Banners)).toBe("5 banerów");
        expect(declineNumeric(13, Resource.Banners)).toBe("13 banerów");
        expect(declineNumeric(24, Resource.Banners)).toBe("24 banery");
      });

      it("should decline neuter noun 'CalendarEvents' correctly", () => {
        // wydarzenie kalendarzowe: acc sg, wydarzenia kalendarzowe: nom pl, wydarzeń kalendarzowych: gen pl
        expect(declineNumeric(0, Resource.CalendarEvents)).toBe(
          "0 wydarzeń kalendarzowych",
        );
        expect(declineNumeric(1, Resource.CalendarEvents)).toBe(
          "1 wydarzenie kalendarzowe",
        );
        expect(declineNumeric(2, Resource.CalendarEvents)).toBe(
          "2 wydarzenia kalendarzowe",
        );
        expect(declineNumeric(5, Resource.CalendarEvents)).toBe(
          "5 wydarzeń kalendarzowych",
        );
        expect(declineNumeric(12, Resource.CalendarEvents)).toBe(
          "12 wydarzeń kalendarzowych",
        );
        expect(declineNumeric(23, Resource.CalendarEvents)).toBe(
          "23 wydarzenia kalendarzowe",
        );
      });

      it("should decline 'link' from REUSABLE_DECLENSIONS correctly", () => {
        // link: link (acc sg), linki (nom pl), linków (gen pl)
        expect(declineNumeric(0, "link")).toBe("0 linków");
        expect(declineNumeric(1, "link")).toBe("1 link");
        expect(declineNumeric(2, "link")).toBe("2 linki");
        expect(declineNumeric(5, "link")).toBe("5 linków");
        expect(declineNumeric(14, "link")).toBe("14 linków");
        expect(declineNumeric(22, "link")).toBe("22 linki");
      });

      it("should decline 'version' from REUSABLE_DECLENSIONS correctly", () => {
        // wersja: wersję (acc sg), wersje (nom pl), wersji (gen pl)
        expect(declineNumeric(0, "version")).toBe("0 wersji");
        expect(declineNumeric(1, "version")).toBe("1 wersję");
        expect(declineNumeric(2, "version")).toBe("2 wersje");
        expect(declineNumeric(5, "version")).toBe("5 wersji");
        expect(declineNumeric(13, "version")).toBe("13 wersji");
        expect(declineNumeric(24, "version")).toBe("24 wersje");
      });
    });

    describe("edge cases", () => {
      it("should handle zero correctly", () => {
        expect(declineNumeric(0, "category")).toBe("0 kategorii");
        expect(declineNumeric(0, Resource.Banners)).toBe("0 banerów");
      });

      it("should handle the 12-14 exception correctly", () => {
        expect(declineNumeric(12, "link")).toBe("12 linków");
        expect(declineNumeric(13, "link")).toBe("13 linków");
        expect(declineNumeric(14, "link")).toBe("14 linków");
        // Should return to normal pattern after 14
        expect(declineNumeric(15, "link")).toBe("15 linków");
      });

      it("should handle large numbers correctly", () => {
        expect(declineNumeric(100, "category")).toBe("100 kategorii");
        expect(declineNumeric(101, Resource.Changes)).toBe("101 zmian");
        expect(declineNumeric(102, Resource.Banners)).toBe("102 banery");
        expect(declineNumeric(111, "link")).toBe("111 linków");
        expect(declineNumeric(112, "version")).toBe("112 wersje");
        expect(declineNumeric(122, "category")).toBe("122 kategorie");
      });

      it("should handle numbers ending in 1 (except 11) correctly", () => {
        expect(declineNumeric(21, "category")).toBe("21 kategorii");
        expect(declineNumeric(31, Resource.Changes)).toBe("31 zmian");
        expect(declineNumeric(41, Resource.Banners)).toBe("41 banerów");
        expect(declineNumeric(101, "link")).toBe("101 linków");
      });

      it("should handle numbers ending in 2-4 (except 12-14) correctly", () => {
        expect(declineNumeric(22, "category")).toBe("22 kategorie");
        expect(declineNumeric(23, Resource.Changes)).toBe("23 zmiany");
        expect(declineNumeric(24, Resource.Banners)).toBe("24 banery");
        expect(declineNumeric(32, "link")).toBe("32 linki");
        expect(declineNumeric(103, "version")).toBe("103 wersje");
        expect(declineNumeric(104, "category")).toBe("104 kategorie");
      });
    });

    describe("different grammatical genders", () => {
      it("should work with masculine nouns", () => {
        expect(declineNumeric(1, Resource.Banners)).toBe("1 baner");
        expect(declineNumeric(3, "link")).toBe("3 linki");
      });

      it("should work with feminine nouns", () => {
        expect(declineNumeric(1, "category")).toBe("1 kategorię");
        expect(declineNumeric(3, "version")).toBe("3 wersje");
      });

      it("should work with neuter nouns", () => {
        expect(declineNumeric(1, Resource.CalendarEvents)).toBe(
          "1 wydarzenie kalendarzowe",
        );
        expect(declineNumeric(3, Resource.CalendarEvents)).toBe(
          "3 wydarzenia kalendarzowe",
        );
      });
    });
  });

  describe("with string overload", () => {
    it("should work with original string parameters", () => {
      expect(declineNumeric(0, "kategorię", "kategorie", "kategorii")).toBe(
        "0 kategorii",
      );
      expect(declineNumeric(1, "kategorię", "kategorie", "kategorii")).toBe(
        "1 kategorię",
      );
      expect(declineNumeric(2, "kategorię", "kategorie", "kategorii")).toBe(
        "2 kategorie",
      );
      expect(declineNumeric(5, "kategorię", "kategorie", "kategorii")).toBe(
        "5 kategorii",
      );
      expect(declineNumeric(13, "kategorię", "kategorie", "kategorii")).toBe(
        "13 kategorii",
      );
      expect(declineNumeric(22, "kategorię", "kategorie", "kategorii")).toBe(
        "22 kategorie",
      );
    });

    it("should work with apple example from JSDoc", () => {
      expect(declineNumeric(1, "jabłko", "jabłka", "jabłek")).toBe("1 jabłko");
      expect(declineNumeric(2, "jabłko", "jabłka", "jabłek")).toBe("2 jabłka");
      expect(declineNumeric(5, "jabłko", "jabłka", "jabłek")).toBe("5 jabłek");
    });

    it("should handle all count ranges with manual strings", () => {
      expect(declineNumeric(0, "opcję", "opcje", "opcji")).toBe("0 opcji");
      expect(declineNumeric(1, "opcję", "opcje", "opcji")).toBe("1 opcję");
      expect(declineNumeric(2, "opcję", "opcje", "opcji")).toBe("2 opcje");
      expect(declineNumeric(3, "opcję", "opcje", "opcji")).toBe("3 opcje");
      expect(declineNumeric(4, "opcję", "opcje", "opcji")).toBe("4 opcje");
      expect(declineNumeric(5, "opcję", "opcje", "opcji")).toBe("5 opcji");
      expect(declineNumeric(11, "opcję", "opcje", "opcji")).toBe("11 opcji");
      expect(declineNumeric(12, "opcję", "opcje", "opcji")).toBe("12 opcji");
      expect(declineNumeric(13, "opcję", "opcje", "opcji")).toBe("13 opcji");
      expect(declineNumeric(14, "opcję", "opcje", "opcji")).toBe("14 opcji");
      expect(declineNumeric(15, "opcję", "opcje", "opcji")).toBe("15 opcji");
      expect(declineNumeric(21, "opcję", "opcje", "opcji")).toBe("21 opcji");
      expect(declineNumeric(22, "opcję", "opcje", "opcji")).toBe("22 opcje");
    });
  });

  describe("overload discrimination", () => {
    it("should correctly distinguish between string and DeclinableNoun", () => {
      // When passing a DeclinableNoun, it should use declension data
      const withNoun = declineNumeric(2, "category");
      expect(withNoun).toBe("2 kategorie");

      // When passing strings, it should use the provided forms
      const withStrings = declineNumeric(2, "custom", "customs", "customów");
      expect(withStrings).toBe("2 customs");

      // These should produce different results if the manual forms differ
      const nounResult = declineNumeric(5, "category");
      const stringResult = declineNumeric(5, "kat", "katy", "katów");
      expect(nounResult).not.toBe(stringResult);
      expect(nounResult).toBe("5 kategorii");
      expect(stringResult).toBe("5 katów");
    });
  });

  describe("with additional options", () => {
    it("should use nominative case when singularCase is set to Nominative", () => {
      // category nominative: kategoria
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("1 kategoria");
    });

    it("should use default accusative case when no option is provided", () => {
      // category accusative: kategorię
      expect(declineNumeric(1, "category")).toBe("1 kategorię");
    });

    it("should use genitive case when singularCase is set to Genitive", () => {
      // category genitive: kategorii
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Genitive,
        }),
      ).toBe("1 kategorii");
    });

    it("should only affect count of 1", () => {
      // With nominative case option
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("1 kategoria");
      expect(
        declineNumeric(2, "category", {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("2 kategorie");
      expect(
        declineNumeric(5, "category", {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("5 kategorii");
    });

    it("should work with Resource enums", () => {
      // Resource.Changes nominative singular: zmiana
      expect(
        declineNumeric(1, Resource.Changes, {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("1 zmiana");

      // Default (accusative): zmianę
      expect(declineNumeric(1, Resource.Changes)).toBe("1 zmianę");
    });

    it("should work with different grammatical cases", () => {
      // Test all cases with 'category'
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Nominative,
        }),
      ).toBe("1 kategoria");
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Genitive,
        }),
      ).toBe("1 kategorii");
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Dative,
        }),
      ).toBe("1 kategorii");
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Accusative,
        }),
      ).toBe("1 kategorię");
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Instrumental,
        }),
      ).toBe("1 kategorią");
      expect(
        declineNumeric(1, "category", {
          singularCase: GrammaticalCase.Locative,
        }),
      ).toBe("1 kategorii");
    });
  });
});
