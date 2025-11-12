import { GrammaticalCase, GrammaticalGender } from "@/config/enums";
import {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type {
  DeclensionData,
  Declensions,
  DeclinableNoun,
  DeclinableNounPhrase,
  Determiner,
} from "@/types/polish";

import { typedEntries } from "./helpers/typescript";

interface DeclensionOptions {
  prependDeterminer?: Determiner | null;
  plural?: boolean;
}

const isDeclinableNounPhrase = (
  noun: DeclinableNoun,
): noun is DeclinableNounPhrase => noun in NOUN_PHRASE_TRANSFORMATIONS;

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions?: DeclensionOptions,
): Declensions & DeclensionData;

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions: DeclensionOptions & { case: GrammaticalCase },
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
 * @example const declensions: Declensions = declineNoun(Resource.GuideArticles) // { nominative: 'artykuł', genitive: 'artykułu', ... }
 * @example declineNoun(Resource.GuideArticles, { case: GrammaticalCase.Nominative, prependDeterminer: "this" }) // 'ten artykuł'
 * @example declineNoun(Resource.StudentOrganizations, { case: GrammaticalCase.Accusative, plural: true }) // 'organizacje studenckie'
 */
export function declineNoun(
  noun: DeclinableNoun,
  {
    case: grammaticalCase,
    prependDeterminer = null,
    plural = false,
  }: DeclensionOptions & { case?: GrammaticalCase } = {},
): string | (Declensions & DeclensionData) {
  const plurality = plural ? "plural" : "singular";
  const isNounPhrase = isDeclinableNounPhrase(noun);
  const base = isNounPhrase ? NOUN_PHRASE_TRANSFORMATIONS[noun].base : noun;
  const {
    gender,
    [plurality]: { ...declensions },
  } = SIMPLE_NOUN_DECLENSIONS[base];
  if (isNounPhrase) {
    const transform = NOUN_PHRASE_TRANSFORMATIONS[noun].transform;
    for (const [key, value] of typedEntries(declensions)) {
      const result = transform(value);
      declensions[key] =
        typeof result === "string" ? result : result[plurality];
    }
  }
  if (prependDeterminer != null) {
    const isMasculine = gender === GrammaticalGender.Masculine;
    const isAnimate = declensions.accusative === declensions.genitive;
    const determinerGender =
      // Exception for inanimate plural masculine nouns
      // https://extra-zgierz.pl/jak-okreslic-rodzaj-rzeczownika-w-liczbie-mnogiej-przewodnik
      plural && isMasculine && !isAnimate ? GrammaticalGender.Feminine : gender;
    const determiner =
      DETERMINER_DECLENSIONS[prependDeterminer][determinerGender][plurality];
    const declensionsWithoutDeterminer = { ...declensions };
    for (const [key, value] of typedEntries(declensions)) {
      declensions[key] = `${determiner[key]} ${value}`;
    }
    if (isMasculine && !plural) {
      // Exception for animate singular masculine nouns in accusative case
      // more details: https://chatgpt.com/share/68f6707c-562c-8002-a1e6-18a68065ae51
      const determinerCase = isAnimate
        ? GrammaticalCase.Genitive
        : GrammaticalCase.Nominative;
      declensions.accusative = `${determiner[determinerCase]} ${declensionsWithoutDeterminer.accusative}`;
    }
  }
  if (grammaticalCase == null) {
    return { ...declensions, gender };
  }
  const declined = declensions[grammaticalCase];
  return declined;
}

/**
 * Declines a quantitative noun based on its count.
 * @param count - The numeric count.
 * @param singular - The singular form of the noun (used for 1).
 * @param paucal - The paucal form of the noun (used for 2, 3, 4).
 * @param plural - The plural form of the noun (used for 0, 5 and above).
 * @returns The declined noun with the count as a space-separated string.
 * @example declineNumeric(1, 'jabłko', 'jabłka', 'jabłek') // '1 jabłko'
 * @example declineNumeric(2, 'jabłko', 'jabłka', 'jabłek') // '2 jabłka'
 * @example declineNumeric(5, 'jabłko', 'jabłka', 'jabłek') // '5 jabłek'
 */
export function declineNumeric(
  count: number,
  singular: string,
  paucal: string,
  plural: string,
): string {
  const countString = count.toString();
  if (count === 1) {
    return `${countString} ${singular}`;
  }
  if (count >= 12 && count <= 14) {
    // Exception for numbers 12, 13 and 14, which always use the plural-many form
    return `${countString} ${plural}`;
  }
  const remainder = count % 10;
  const isMany = remainder <= 1 || remainder >= 5;
  return `${countString} ${isMany ? plural : paucal}`;
}
