import { GrammaticalCase } from "../enums";
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
  return {
    singular: declineNoun(noun, {
      case: GrammaticalCase.Accusative,
      plural: false,
    }),
    paucal: declineNoun(noun, {
      case: GrammaticalCase.Nominative,
      plural: true,
    }),
    plural: declineNoun(noun, {
      case: GrammaticalCase.Genitive,
      plural: true,
    }),
  };
}
