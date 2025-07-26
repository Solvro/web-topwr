import {
  DETERMINER_DECLENSIONS,
  RESOURCE_DECLENSIONS,
} from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
import type { Declensions } from "@/types/app";

interface DeclensionOptions {
  case?: DeclensionCase;
  prependDeterminer?: boolean;
  plural?: boolean;
}

/**
 * Returns the declined form of a resource noun based on the specified case.
 * Optionally prepends the determiner based on the resource's gender.
 * @param resource - The resource to decline.
 * @param declensionOptions - Additional options for declension.
 * @param declensionOptions.prependDeterminer - Whether to prepend the determiner (i.e. to, ten, ta in the correct declension).
 * @param declensionOptions.plural - Whether to use the plural form.
 * @returns All declensions of the resource noun.
 * @example
 * const declensions: Declensions = declineNoun(Resource.GuideArticles);
 */
export function declineNoun(
  resource: Resource,
  declensionOptions?: Omit<DeclensionOptions, "case">,
): Declensions;
/**
 * Returns the declined form of a resource noun based on the specified case.
 * Optionally prepends the determiner based on the resource's gender.
 * @param resource - The resource to decline.
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
  resource: Resource,
  declensionOptions: { case: DeclensionCase } & Omit<DeclensionOptions, "case">,
): string;

export function declineNoun(
  resource: Resource,
  {
    case: declensionCase,
    prependDeterminer = false,
    plural = false,
  }: DeclensionOptions = {},
): string | Declensions {
  const quantity = plural ? "plural" : "singular";
  const declensions = RESOURCE_DECLENSIONS[quantity][resource];
  if (declensionCase == null) {
    return declensions;
  }
  const result = declensions[declensionCase];
  return prependDeterminer
    ? `${DETERMINER_DECLENSIONS[quantity][declensions.gender][declensionCase]} ${result}`
    : result;
}
