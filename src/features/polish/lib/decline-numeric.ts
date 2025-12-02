import type { GrammaticalCase } from "../enums";
import type { DeclinableNoun } from "../types/internal";
import { getNumericFormsFromNoun } from "../utils/get-numeric-forms-from-noun";
import { isDeclinableNoun } from "../utils/is-declinable-noun";
import { declineNoun } from "./decline-noun";

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
  options?: { singularCase: GrammaticalCase },
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
  paucalOrOptions?: string | { singularCase: GrammaticalCase },
  plural?: string,
): string {
  let singular: string;
  let paucalForm: string;
  let pluralForm: string;
  let oneFormValue: string | undefined;

  if (isDeclinableNoun(singularOrNoun)) {
    const forms = getNumericFormsFromNoun(singularOrNoun);
    singular = forms.singular;
    paucalForm = forms.paucal;
    pluralForm = forms.plural;

    // Handle options object with singularCase
    if (paucalOrOptions !== undefined && typeof paucalOrOptions === "object") {
      oneFormValue = declineNoun(singularOrNoun, {
        case: paucalOrOptions.singularCase,
      });
    }
  } else {
    if (paucalOrOptions == null || plural == null) {
      throw new TypeError(
        "Invalid arguments: when providing a string as second argument, paucal and plural forms are required",
      );
    }
    if (typeof paucalOrOptions !== "string") {
      throw new TypeError(
        "Invalid arguments: options object can only be used with DeclinableNoun",
      );
    }
    singular = singularOrNoun;
    paucalForm = paucalOrOptions;
    pluralForm = plural;
  }

  const countString = count.toString();
  if (count === 1) {
    if (oneFormValue !== undefined) {
      return `${countString} ${oneFormValue}`;
    }
    return `${countString} ${singular}`;
  }
  if (count >= 12 && count <= 14) {
    // Exception for numbers 12, 13 and 14, which always use the plural-many form
    return `${countString} ${pluralForm}`;
  }
  const remainder = count % 10;
  const isMany = remainder <= 1 || remainder >= 5;
  return `${countString} ${isMany ? pluralForm : paucalForm}`;
}
