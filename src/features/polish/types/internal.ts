import type { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

import type { DETERMINER_DECLENSIONS } from "../data/determiner-declensions";
import type { NOUN_PHRASE_TRANSFORMATIONS } from "../data/noun-phrase-transformations";
import type { SIMPLE_NOUN_DECLENSIONS } from "../data/simple-noun-declensions";
import type { GrammaticalCase, GrammaticalGender } from "../enums";

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

export interface DeclensionOptions {
  prependDeterminer?: Determiner | null;
  plural?: boolean;
}

export interface Pluralized<T extends Record<string, unknown>> {
  singular: T;
  plural: { [K in keyof T]: T[K] };
}

export interface NumericDeclensionOptions {
  singularCase: GrammaticalCase;
}
