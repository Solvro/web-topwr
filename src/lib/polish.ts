import type { DeclensionCase, GrammaticalGender } from "@/config/enums";
import {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type {
  Declensions,
  DeclinableNoun,
  DeclinableSimpleNoun,
  Determiner,
} from "@/types/app";

import { typedEntries } from "./helpers";

interface DeclensionOptions {
  prependDeterminer?: Determiner | null;
  plural?: boolean;
}

const isSimpleNoun = (noun: DeclinableNoun): noun is DeclinableSimpleNoun =>
  noun in SIMPLE_NOUN_DECLENSIONS;

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions?: DeclensionOptions,
): Declensions & { gender: GrammaticalGender };

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions: DeclensionOptions & { case: DeclensionCase },
): string;

/**
 * Returns the declined form of a noun based on the specified case.
 * Optionally prepends the determiner based on the noun's gender.
 * @param noun - The noun to decline.
 * @param declensionOptions - Additional options for declension.
 * @param declensionOptions.case - The grammatical case to use for declension. If not provided, returns all declensions.
 * @param declensionOptions.prependDeterminer - The determiner to prepend (e.g. for "this": to, ten, ta) in the correct declension, if any.
 * @param declensionOptions.plural - Whether to use the plural form.
 * @returns The declined noun string or all of its declensions if no case is provided.
 * @example
 * const declensions: Declensions = declineNoun(Resource.GuideArticles);
 *
 * declineNoun(Resource.GuideArticles, { case: DeclensionCase.Nominative, prependDeterminer: "this" }) // 'ten artykuł'
 *
 * declineNoun(Resource.StudentOrganizations, { case: DeclensionCase.Accusative, plural: true }) // 'organizacje studenckie'
 */
export function declineNoun(
  noun: DeclinableNoun,
  {
    case: declensionCase,
    prependDeterminer = null,
    plural = false,
  }: DeclensionOptions & { case?: DeclensionCase } = {},
): string | (Declensions & { gender: GrammaticalGender }) {
  const plurality = plural ? "plural" : "singular";
  const isSimple = isSimpleNoun(noun);
  const base = isSimple ? noun : NOUN_PHRASE_TRANSFORMATIONS[noun].base;
  const {
    gender,
    [plurality]: { ...declensions },
  } = SIMPLE_NOUN_DECLENSIONS[base];
  if (!isSimple) {
    const transform = NOUN_PHRASE_TRANSFORMATIONS[noun].transform;
    for (const [key, value] of typedEntries(declensions)) {
      declensions[key] = transform(value);
    }
  }
  if (prependDeterminer != null) {
    const determiner =
      DETERMINER_DECLENSIONS[prependDeterminer][gender][plurality];
    for (const [key, value] of typedEntries(declensions)) {
      declensions[key] = `${determiner[key]} ${value}`;
    }
  }
  if (declensionCase == null) {
    return { ...declensions, gender };
  }
  const declined = declensions[declensionCase];
  return declined;
}
