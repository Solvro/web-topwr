import type { DeclinableNoun } from "../types/internal";
import { getNumericFormsFromNoun } from "../utils/get-numeric-forms-from-noun";
import { isDeclinableNoun } from "../utils/is-declinable-noun";

/**
 * Declines a quantitative noun based on its count using a DeclinableNoun.
 * @param count - The numeric count.
 * @param noun - The DeclinableNoun to decline.
 * @param defaultOneForm - Optional custom form to use when count is 1 (overrides default behavior).
 * @returns The declined noun with the count as a space-separated string.
 * @example declineNumeric(1, 'category') // '1 kategoria'
 * @example declineNumeric(2, 'category') // '2 kategorie'
 * @example declineNumeric(5, 'category') // '5 kategorii'
 * @example declineNumeric(1, 'category', 'jedna kategoria') // 'jedna kategoria'
 */
export function declineNumeric(
  count: number,
  noun: DeclinableNoun,
  defaultOneForm?: string,
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
  paucalOrDefaultOneForm?: string,
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
    oneFormValue = paucalOrDefaultOneForm;
  } else {
    if (paucalOrDefaultOneForm == null || plural == null) {
      throw new TypeError(
        "Invalid arguments: when providing a string as second argument, paucal and plural forms are required",
      );
    }
    singular = singularOrNoun;
    paucalForm = paucalOrDefaultOneForm;
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
