import type { DeclensionCase, GrammaticalGender } from "@/config/enums";
import {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type {
  Declensions,
  DeclinableNoun,
  DeclinableSimpleNoun,
} from "@/types/app";

interface DeclensionOptions {
  prependDeterminer?: boolean;
  plural?: boolean;
}

const isSimpleNoun = (noun: DeclinableNoun): noun is DeclinableSimpleNoun =>
  noun in SIMPLE_NOUN_DECLENSIONS;

export function declineNoun(
  noun: DeclinableNoun,
  declensionOptions?: DeclensionOptions,
): Declensions & { gender: GrammaticalGender };

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
 * @param declensionOptions.prependDeterminer - Whether to prepend the determiner (i.e. to, ten, ta in the correct declension).
 * @param declensionOptions.plural - Whether to use the plural form.
 * @returns The declined noun string or all of its declensions if no case is provided.
 * @example
 * const declensions: Declensions = declineNoun(Resource.GuideArticles);
 *
 * declineNoun(Resource.GuideArticles, { case: DeclensionCase.Nominative, prependDeterminer: true }) // 'ten artykuł'
 *
 * declineNoun(Resource.StudentOrganizations, { case: DeclensionCase.Accusative, plural: true }) // 'organizacje studenckie'
 */
export function declineNoun(
  noun: DeclinableNoun,
  {
    case: declensionCase,
    prependDeterminer = false,
    plural = false,
  }: DeclensionOptions & { case?: DeclensionCase } = {},
): string | (Declensions & { gender: GrammaticalGender }) {
  const plurality = plural ? "plural" : "singular";
  const isSimple = isSimpleNoun(noun);
  const base = isSimple ? noun : NOUN_PHRASE_TRANSFORMATIONS[noun].base;
  const {
    gender,
    [plurality]: { ...declensions },
  } = SIMPLE_NOUN_DECLENSIONS[base];
  if (!isSimple) {
    const transform = NOUN_PHRASE_TRANSFORMATIONS[noun].transform;
    for (const key in declensions) {
      const currentCase = key as DeclensionCase;
      declensions[currentCase] = transform(declensions[currentCase]);
    }
  }
  if (declensionCase == null) {
    return { ...declensions, gender };
  }
  const declined = declensions[declensionCase];
  return prependDeterminer
    ? `${DETERMINER_DECLENSIONS[gender][plurality][declensionCase]} ${declined}`
    : declined;
}
