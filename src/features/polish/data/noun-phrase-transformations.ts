import { Resource } from "@/features/resources/enums";

import type { DeclinableSimpleNoun } from "../types/internal";

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
  [Resource.AboutUsLinks]: {
    base: "link",
    transform: (base) => `${base} do sociali`,
  },
  [Resource.NotificationTopics]: {
    base: "category",
    transform: (base) => ({
      singular: `${base} powiadomienia`,
      plural: `${base} powiadomień`,
    }),
  },
} satisfies Record<
  string,
  // TODO: use the Pluralized type
  {
    base: DeclinableSimpleNoun;
    transform: (base: string) => string | { singular: string; plural: string };
  }
>;
