import { declineNoun } from "../lib/decline-noun";
import type { DeclinableNoun } from "../types/internal";

/**
 * Helper function to extract numeric declension forms from a DeclinableNoun.
 * @param noun - The noun to extract forms from.
 * @returns Object containing singular, paucal, and plural forms.
 */
export function getNumericFormsFromNoun(noun: DeclinableNoun): {
  singular: string;
  paucal: string;
  plural: string;
} {
  const singularDeclensions = declineNoun(noun, { plural: false });
  const pluralDeclensions = declineNoun(noun, { plural: true });

  return {
    singular: singularDeclensions.accusative,
    paucal: pluralDeclensions.nominative,
    plural: pluralDeclensions.genitive,
  };
}
