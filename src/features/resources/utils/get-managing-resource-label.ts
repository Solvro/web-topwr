import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { ResourceLabelOptions } from "@/types/components";

import { Resource } from "../enums";

/**
 * Declines the resource name correctly and uses its first word only.
 * Used to ensure the label isn't too long.
 *
 * @example getManagingResourceLabel(Resource.StudentOrganizations) === 'Zarządzanie organizacjami'
 */
export function getManagingResourceLabel(
  resource: Resource,
  { firstWordOnly = true, plural = true }: ResourceLabelOptions = {},
): string {
  if (
    [
      Resource.FoodSpots,
      Resource.PinkBoxes,
      Resource.PolinkaStations,
      Resource.BicycleShowers,
      Resource.Aeds,
      Resource.SpecialHours,
      Resource.RegularHours,
      Resource.SksOpeningHours,
    ].includes(resource)
  ) {
    firstWordOnly = false;
  }

  const declined = declineNoun(resource, {
    case: GrammaticalCase.Instrumental,
    plural,
  });
  const firstWord = firstWordOnly ? declined.split(" ")[0] : declined;
  return `Zarządzanie ${firstWord}`;
}
