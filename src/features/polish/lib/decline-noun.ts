import { typedEntries } from "@/utils";

import { DETERMINER_DECLENSIONS } from "../data/determiner-declensions";
import { NOUN_PHRASE_TRANSFORMATIONS } from "../data/noun-phrase-transformations";
import { SIMPLE_NOUN_DECLENSIONS } from "../data/simple-noun-declensions";
import { GrammaticalCase, GrammaticalGender } from "../enums";
import type {
  DeclensionData,
  DeclensionOptions,
  Declensions,
  DeclinableNoun,
} from "../types/internal";
import { isDeclinableNounPhrase } from "../utils/is-declinable-noun-phrase";

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
