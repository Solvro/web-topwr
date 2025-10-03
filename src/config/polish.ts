import type {
  Declensions,
  DeclinableSimpleNoun,
  Pluralized,
  RecordIntersection,
} from "@/types/app";

import { GrammaticalGender, Resource } from "./enums";

/** A dictionary of Polish language declensions of all resource names & other nouns, as well as their genders for use with determiners. */
export const SIMPLE_NOUN_DECLENSIONS = {
  [Resource.GuideArticles]: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "artykuł",
      genitive: "artykułu",
      dative: "artykułowi",
      accusative: "artykuł",
      instrumental: "artykułem",
      locative: "artykule",
      vocative: "artykule",
    },
    plural: {
      nominative: "artykuły",
      genitive: "artykułów",
      dative: "artykułom",
      accusative: "artykuły",
      instrumental: "artykułami",
      locative: "artykułach",
      vocative: "artykuły",
    },
  },
  [Resource.StudentOrganizations]: {
    gender: GrammaticalGender.Feminine,
    singular: {
      nominative: "organizacja studencka",
      genitive: "organizacji studenckiej",
      dative: "organizacji studenckiej",
      accusative: "organizację studencką",
      instrumental: "organizacją studencką",
      locative: "organizacji studenckiej",
      vocative: "organizacjo studencka",
    },
    plural: {
      nominative: "organizacje studenckie",
      genitive: "organizacji studenckich",
      dative: "organizacjom studenckim",
      accusative: "organizacje studenckie",
      instrumental: "organizacjami studenckimi",
      locative: "organizacjach studenckich",
      vocative: "organizacje studenckie",
    },
  },
  [Resource.CalendarEvents]: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "wydarzenie kalendarzowe",
      genitive: "wydarzenia kalendarzowego",
      dative: "wydarzeniu kalendarzowemu",
      accusative: "wydarzenie kalendarzowe",
      instrumental: "wydarzeniem kalendarzowym",
      locative: "wydarzeniu kalendarzowemu",
      vocative: "wydarzenie kalendarzowe",
    },
    plural: {
      nominative: "wydarzenia kalendarzowe",
      genitive: "wydarzeń kalendarzowych",
      dative: "wydarzeniom kalendarzowym",
      accusative: "wydarzenia kalendarzowe",
      instrumental: "wydarzeniami kalendarzowymi",
      locative: "wydarzeniach kalendarzowych",
      vocative: "wydarzenia kalendarzowe",
    },
  },
  [Resource.Banners]: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "baner",
      genitive: "baneru",
      dative: "banerowi",
      accusative: "baner",
      instrumental: "banerem",
      locative: "banerze",
      vocative: "banerze",
    },
    plural: {
      nominative: "banery",
      genitive: "banerów",
      dative: "banerom",
      accusative: "banery",
      instrumental: "banerami",
      locative: "banerach",
      vocative: "banery",
    },
  },
  image: {
    gender: GrammaticalGender.Neuter,
    singular: {
      nominative: "zdjęcie",
      genitive: "zdjęcia",
      dative: "zdjęciu",
      accusative: "zdjęcie",
      instrumental: "zdjęciem",
      locative: "zdjęciu",
      vocative: "zdjęcie",
    },
    plural: {
      nominative: "zdjęcia",
      genitive: "zdjęć",
      dative: "zdjęciom",
      accusative: "zdjęcia",
      instrumental: "zdjęciami",
      locative: "zdjęciach",
      vocative: "zdjęcia",
    },
  },
  name: {
    gender: GrammaticalGender.Feminine,
    singular: {
      nominative: "nazwa",
      genitive: "nazwy",
      dative: "nazwie",
      accusative: "nazwę",
      instrumental: "nazwą",
      locative: "nazwie",
      vocative: "nazwa",
    },
    plural: {
      nominative: "nazwy",
      genitive: "nazw",
      dative: "nazwom",
      accusative: "nazwy",
      instrumental: "nazwami",
      locative: "nazwach",
      vocative: "nazwy",
    },
  },
  title: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "tytuł",
      genitive: "tytułu",
      dative: "tytułowi",
      accusative: "tytuł",
      instrumental: "tytułem",
      locative: "tytule",
      vocative: "tytule",
    },
    plural: {
      nominative: "tytuły",
      genitive: "tytułów",
      dative: "tytułom",
      accusative: "tytuły",
      instrumental: "tytułami",
      locative: "tytułach",
      vocative: "tytuły",
    },
  },
  description: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "opis",
      genitive: "opisu",
      dative: "opisowi",
      accusative: "opis",
      instrumental: "opisem",
      locative: "opisie",
      vocative: "opisie",
    },
    plural: {
      nominative: "opisy",
      genitive: "opisów",
      dative: "opisy",
      accusative: "opisy",
      instrumental: "opisami",
      locative: "opisach",
      vocative: "opisy",
    },
  },
  shortDescription: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "krótki opis",
      genitive: "krótkiego opisu",
      dative: "krótkiemu opisowi",
      accusative: "krótki opis",
      instrumental: "krótkim opisem",
      locative: "krótkim opisie",
      vocative: "krótkim opisie",
    },
    plural: {
      nominative: "krótkie opisy",
      genitive: "krótkich opisów",
      dative: "krótkim opisom",
      accusative: "krótkie opisy",
      instrumental: "krótkimi opisami",
      locative: "krótkich opisach",
      vocative: "krótkie opisy",
    },
  },
  id: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "identyfikator",
      genitive: "identyfikatora",
      dative: "identyfikatorowi",
      accusative: "identyfikator",
      instrumental: "identyfikatorem",
      locative: "identyfikatorze",
      vocative: "identyfikatorze",
    },
    plural: {
      nominative: "identyfikatory",
      genitive: "identyfikatorów",
      dative: "identyfikatorom",
      accusative: "identyfikatory",
      instrumental: "identyfikatorami",
      locative: "identyfikatorach",
      vocative: "identyfikatory",
    },
  },
  date: {
    gender: GrammaticalGender.Feminine,
    singular: {
      nominative: "data",
      genitive: "daty",
      dative: "dacie",
      accusative: "datę",
      instrumental: "datą",
      locative: "dacie",
      vocative: "dato",
    },
    plural: {
      nominative: "daty",
      genitive: "dat",
      dative: "datom",
      accusative: "daty",
      instrumental: "datami",
      locative: "datach",
      vocative: "daty",
    },
  },
} satisfies RecordIntersection<
  Resource,
  string,
  { gender: GrammaticalGender } & Pluralized<Declensions>
>;

/** Noun phrase mappings that inflect like their base noun with genitive transformations (e.g. 'data' → 'data utworzenia'). */
export const NOUN_PHRASE_TRANSFORMATIONS = {
  createdAt: {
    base: "date",
    transform: (base) => `${base} utworzenia`,
  },
  updatedAt: {
    base: "date",
    transform: (base) => `${base} aktualizacji`,
  },
} satisfies Record<
  string,
  { base: DeclinableSimpleNoun; transform: (base: string) => string }
>;

/** A static dictionary of declensions for determiners in the Polish language. */
export const DETERMINER_DECLENSIONS: Record<
  GrammaticalGender,
  Pluralized<Declensions>
> = {
  [GrammaticalGender.Masculine]: {
    singular: {
      nominative: "ten",
      genitive: "tego",
      dative: "temu",
      accusative: "ten",
      instrumental: "tym",
      locative: "tym",
      vocative: "ten",
    },
    plural: {
      nominative: "ci",
      genitive: "tych",
      dative: "tym",
      accusative: "tych",
      instrumental: "tymi",
      locative: "tych",
      vocative: "ci",
    },
  },
  [GrammaticalGender.Feminine]: {
    singular: {
      nominative: "ta",
      genitive: "tej",
      dative: "tej",
      accusative: "tę",
      instrumental: "tą",
      locative: "tej",
      vocative: "ta",
    },
    plural: {
      nominative: "te",
      genitive: "tych",
      dative: "tym",
      accusative: "te",
      instrumental: "tymi",
      locative: "tych",
      vocative: "te",
    },
  },
  [GrammaticalGender.Neuter]: {
    singular: {
      nominative: "to",
      genitive: "tego",
      dative: "temu",
      accusative: "to",
      instrumental: "tym",
      locative: "tym",
      vocative: "to",
    },
    plural: {
      nominative: "te",
      genitive: "tych",
      dative: "tym",
      accusative: "te",
      instrumental: "tymi",
      locative: "tych",
      vocative: "te",
    },
  },
};
