import {
  GrammaticalCase,
  declineNoun,
  declineNumeric,
} from "@/features/polish";
import { Resource, getResourceRelationDefinitions } from "@/features/resources";
import { RelationType } from "@/features/resources/enums";
import { typedEntries } from "@/utils";

import type { MappedCalendarData } from "../types/internal";

export function getModalDescription(
  resource: Resource,
  clickedDay: string | null,
  totalCount: number,
  mappedData: MappedCalendarData,
): string {
  const relationDefinitions = getResourceRelationDefinitions(resource);
  const relatedResources = typedEntries(relationDefinitions)
    .filter(([_, definition]) => definition.type === RelationType.OneToMany)
    .map(([relatedResource]) => relatedResource);

  if (clickedDay === null) {
    const count = typedEntries(mappedData.semesters).length;

    return count === 0
      ? `Brak ${declineNoun(resource, { case: GrammaticalCase.Genitive, plural: true })}`
      : `Utworzono ${declineNumeric(count, resource)}.`;
  }

  if (relatedResources.length === 0) {
    return totalCount === 0
      ? `Brak ${declineNoun(resource, { case: GrammaticalCase.Genitive, plural: true })} na ten dzień`
      : `W tym dniu zaplanowano ${declineNumeric(totalCount, resource)}.`;
  }

  const resourceCounts = new Map<Resource, number>();

  for (const [_, semesterStructure] of typedEntries(mappedData.semesters)) {
    const dayData = semesterStructure.semesterEvents[clickedDay];
    if (dayData === undefined) {
      continue;
    }

    for (const relatedResource of relatedResources) {
      const currentCount = resourceCounts.get(relatedResource) ?? 0;

      if (relatedResource === Resource.DaySwaps) {
        resourceCounts.set(
          relatedResource,
          currentCount + dayData.daySwaps.length,
        );
      } else if (relatedResource === Resource.Holidays) {
        resourceCounts.set(
          relatedResource,
          currentCount + dayData.holidays.length,
        );
      }
    }
  }

  const resourceDescriptions = relatedResources.reduce<string[]>(
    (accumulator, relatedResource) => {
      const count = resourceCounts.get(relatedResource) ?? 0;
      if (count > 0) {
        accumulator.push(declineNumeric(count, relatedResource));
      }
      return accumulator;
    },
    [],
  );

  if (resourceDescriptions.length === 0) {
    const declinedNames = relatedResources.map((r) =>
      declineNoun(r, { case: GrammaticalCase.Genitive, plural: true }),
    );
    const formattedNames =
      declinedNames.length === 1
        ? declinedNames[0]
        : `${declinedNames.slice(0, -1).join(", ")} i ${String(declinedNames.at(-1))}`;
    return `Brak ${formattedNames} na ten dzień`;
  }

  const description =
    resourceDescriptions.length === 1
      ? resourceDescriptions[0]
      : `${resourceDescriptions.slice(0, -1).join(", ")} i ${String(resourceDescriptions.at(-1))}`;
  return `W tym dniu zaplanowano ${description}.`;
}
