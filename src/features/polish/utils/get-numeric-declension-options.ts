import { declineNoun } from "../lib/decline-noun";
import type { NumericDeclensionOptions } from "../types/internal";
import { getNumericFormsFromNoun } from "./get-numeric-forms-from-noun";
import { isDeclinableNoun } from "./is-declinable-noun";

/**
 * Parses the provided arguments to extract numeric declension options.
 * @param options The arguments provided to the declension function.
 * @param options.singularOrNoun Either a DeclinableNoun or the singular form of the noun.
 * @param options.paucalOrOptions Either the paucal form of the noun or an options object for declension.
 * @param options.pluralOverride The plural form of the noun (required if the first argument is a string).
 * @returns an object containing the singular, paucal, and plural forms of the noun.
 */
export const getNumericDeclensionOptions = ({
  singularOrNoun,
  paucalOrOptions,
  pluralOverride,
}: {
  singularOrNoun: string;
  paucalOrOptions?: string | NumericDeclensionOptions;
  pluralOverride?: string;
}): {
  singular: string;
  plural: string;
  paucal: string;
} => {
  if (isDeclinableNoun(singularOrNoun)) {
    const forms = getNumericFormsFromNoun(singularOrNoun);
    const singular =
      typeof paucalOrOptions === "object"
        ? declineNoun(singularOrNoun, {
            case: paucalOrOptions.singularCase,
          })
        : forms.singular;
    return { ...forms, singular };
  }
  if (paucalOrOptions == null || pluralOverride == null) {
    throw new TypeError(
      "Invalid arguments: when providing a string as second argument, paucal and plural forms are required",
    );
  }
  if (typeof paucalOrOptions !== "string") {
    throw new TypeError(
      "Invalid arguments: options object can only be used with DeclinableNoun",
    );
  }
  return {
    singular: singularOrNoun,
    paucal: paucalOrOptions,
    plural: pluralOverride,
  };
};
