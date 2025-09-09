import { DETERMINER_DECLENSIONS, NOUN_DECLENSIONS } from "@/config/constants";
import type { DeclensionCase, GrammaticalGender } from "@/config/enums";
import type { Declensions, DeclinableNoun } from "@/types/app";

interface DeclensionOptions {
  prependDeterminer?: boolean;
  plural?: boolean;
}

/**
 * Returns the declined form of a noun based on the specified case.
 * Optionally prepends the determiner based on the noun's gender.
 * @param noun - The noun to decline.
 * @param declensionOptions - Additional options for declension.
 * @param declensionOptions.prependDeterminer - Whether to prepend the determiner (i.e. to, ten, ta in the correct declension).
 * @param declensionOptions.plural - Whether to use the plural form.
 * @returns All declensions of the noun.
 * @example
 * const declensions: Declensions = declineNoun(Resource.GuideArticles);
 */
export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions?: DeclensionOptions,
): Declensions & { gender: GrammaticalGender };
/**
 * Returns the declined form of a noun based on the specified case.
 * Optionally prepends the determiner based on the noun's gender.
 * @param noun - The noun to decline.
 * @param declensionOptions - Additional options for declension.
 * @param declensionOptions.case - The grammatical case to use for declension. If not provided, returns all declensions.
 * @param declensionOptions.prependDeterminer - Whether to prepend the determiner (i.e. to, ten, ta in the correct declension).
 * @param declensionOptions.plural - Whether to use the plural form.
 * @returns The declined noun string.
 * @example
 * declineNoun(Resource.GuideArticles, { case: DeclensionCase.Nominative, prependDeterminer: true }) === 'ten artykuł'
 * declineNoun(Resource.StudentOrganizations, { case: DeclensionCase.Accusative, plural: true }) === 'organizacje studenckie'
 */
export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions: DeclensionOptions & { case: DeclensionCase },
): string;

export function declineNoun(
  noun: DeclinableNoun,
  {
    case: declensionCase,
    prependDeterminer = false,
    plural = false,
  }: DeclensionOptions & { case?: DeclensionCase } = {},
): string | (Declensions & { gender: GrammaticalGender }) {
  const quantity = plural ? "plural" : "singular";
  const { gender, [quantity]: declensions } = NOUN_DECLENSIONS[noun];
  if (declensionCase == null) {
    return { ...declensions, gender };
  }
  const result = declensions[declensionCase];
  return prependDeterminer
    ? `${DETERMINER_DECLENSIONS[gender][quantity][declensionCase]} ${result}`
    : result;
}
