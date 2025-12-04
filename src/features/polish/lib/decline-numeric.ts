import type {
  DeclinableNoun,
  NumericDeclensionOptions,
} from "../types/internal";
import { getNumericDeclensionOptions } from "../utils/get-numeric-declension-options";

/**
 * Declines a quantitative noun based on its count using a DeclinableNoun.
 * @param count - The numeric count.
 * @param noun - The DeclinableNoun to decline.
 * @param options - Optional configuration for the singular form when count is 1.
 * @param options.singularCase - The grammatical case to use when count is 1 (overrides default accusative).
 * @returns The declined noun with the count as a space-separated string.
 * @example declineNumeric(1, 'category') // '1 kategorię'
 * @example declineNumeric(2, 'category') // '2 kategorie'
 * @example declineNumeric(5, 'category') // '5 kategorii'
 * @example declineNumeric(1, 'category', { singularCase: GrammaticalCase.Nominative }) // '1 kategoria'
 */
export function declineNumeric(
  count: number,
  noun: DeclinableNoun,
  options?: NumericDeclensionOptions,
): string;

/**
 * Declines a quantitative noun based on its count using manual forms.
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
): string;

export function declineNumeric(
  count: number,
  singularOrNoun: string,
  paucalOrOptions?: string | NumericDeclensionOptions,
  pluralOverride?: string,
): string {
  const { singular, plural, paucal } = getNumericDeclensionOptions({
    singularOrNoun,
    paucalOrOptions,
    pluralOverride,
  });
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
