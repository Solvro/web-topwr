import type {
  GrammaticalCase,
  GrammaticalGender,
  Resource,
} from "@/config/enums";
import type {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";

import type { ResourceDataType } from "./app";

export type Declensions = Record<GrammaticalCase, string>;
export type DeclinableSimpleNoun = keyof typeof SIMPLE_NOUN_DECLENSIONS;
export type DeclinableNounPhrase = keyof typeof NOUN_PHRASE_TRANSFORMATIONS;
export type DeclinableNoun = DeclinableSimpleNoun | DeclinableNounPhrase;
/** Extracts from the fields of a resource only those which have defined translations and declinations in Polish. */
export type ResourceDeclinableField<T extends Resource> =
  keyof ResourceDataType<T> & DeclinableNoun;
export type Determiner = keyof typeof DETERMINER_DECLENSIONS;
export interface DeclensionData {
  /** Determines whether you use "ten", "ta" or "to" as a determiner for this noun. */
  gender: GrammaticalGender;
}
