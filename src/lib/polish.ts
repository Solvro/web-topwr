import { DeclensionCase, GrammaticalGender } from "@/config/enums";
import {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type {
  DeclensionData,
  Declensions,
  DeclinableNoun,
  DeclinableSimpleNoun,
  Determiner,
} from "@/types/polish";

import { typedEntries } from "./helpers/typescript";

interface DeclensionOptions {
  prependDeterminer?: Determiner | null;
  plural?: boolean;
}

const isSimpleNoun = (noun: DeclinableNoun): noun is DeclinableSimpleNoun =>
  noun in SIMPLE_NOUN_DECLENSIONS;

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions?: DeclensionOptions,
): Declensions & DeclensionData;

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
): string | (Declensions & DeclensionData) {
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
        ? DeclensionCase.Genitive
        : DeclensionCase.Nominative;
      declensions.accusative = `${determiner[determinerCase]} ${declensionsWithoutDeterminer.accusative}`;
    }
  }
  if (declensionCase == null) {
    return { ...declensions, gender };
  }
  const declined = declensions[declensionCase];
  return declined;
}

/**
 * Conjugates a quantitative noun based on its count.
 * (1, 'jabłko', 'jabłka', 'jabłek') => '1 jabłko'
 * (2, 'jabłko', 'jabłka', 'jabłek') => '2 jabłka'
 * (5, 'jabłko', 'jabłka', 'jabłek') => '5 jabłek'
 */
export function conjugateNumeric(
  count: number,
  singular: string,
  double: string,
  plural: string,
) {
  const countString = count.toString();
  if (count === 1) {
    return `${countString} ${singular}`;
  }
  const remainder = count % 10;
  if (count >= 12 && count <= 14) {
    // Exception for numbers 12, 13 and 14, which are conjugated differently
    return `${countString} ${plural}`;
  }
  const useSuffixB = remainder <= 1 || remainder >= 5;
  return `${countString} ${useSuffixB ? plural : double}`;
}
