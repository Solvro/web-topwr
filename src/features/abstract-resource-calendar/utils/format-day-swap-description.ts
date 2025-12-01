import type { Weekday } from "@/config/enums";
import {
  DETERMINER_DECLENSIONS,
  GrammaticalCase,
  declineNoun,
} from "@/features/polish";

/**
 * Creates a properly declined Polish string for day swap description
 * @param changedWeekday - The weekday enum value from the day swap
 * @param changedDayIsEven - Whether the changed day is even
 * @returns A string in the format "{parzysty/nieparzysty} {weekday}" with proper Polish declension
 * @example
 * formatDaySwapDescription(Weekday.Monday, true) // "Parzysty poniedziałek"
 * formatDaySwapDescription(Weekday.Wednesday, false) // "Nieparzysta środa"
 */
export function formatDaySwapDescription(
  changedWeekday: Weekday,
  changedDayIsEven: boolean,
): string {
  const declinedWeekday = declineNoun(changedWeekday, {
    case: GrammaticalCase.Nominative,
  });

  const weekdayDeclensions = declineNoun(changedWeekday);
  const weekdayGender = weekdayDeclensions.gender;

  const adjectiveKey = changedDayIsEven ? "even" : "odd";
  const declinedAdjective =
    DETERMINER_DECLENSIONS[adjectiveKey][weekdayGender].singular.nominative;

  return `${declinedAdjective.charAt(0).toUpperCase() + declinedAdjective.slice(1)} ${declinedWeekday}`;
}
