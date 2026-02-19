import { format } from "date-fns";
import { pl } from "date-fns/locale";

import { GrammaticalCase, declineNoun } from "@/features/polish";
import { getResourceRelationDefinitions } from "@/features/resources";
import type { Resource } from "@/features/resources";
import { RelationType } from "@/features/resources/enums";
import { toTitleCase, typedEntries } from "@/utils";

export function getModalHeader(
  resource: Resource,
  clickedDay: string | null,
): string {
  const relationDefinitions = getResourceRelationDefinitions(resource);
  const relatedResources = typedEntries(relationDefinitions)
    .filter(([_, definition]) => definition.type === RelationType.OneToMany)
    .map(([relatedResource]) => relatedResource);

  if (clickedDay === null) {
    return toTitleCase(
      declineNoun(resource, {
        case: GrammaticalCase.Nominative,
        plural: true,
      }),
    );
  } else {
    const clickedDayFormatted = format(new Date(clickedDay), "dd MMMM yyyy", {
      locale: pl,
    });
    return relatedResources.length > 0
      ? relatedResources.length === 1
        ? `${toTitleCase(
            declineNoun(relatedResources[0], {
              case: GrammaticalCase.Nominative,
              plural: true,
            }),
          )} ${clickedDayFormatted}`
        : `${toTitleCase(
            relatedResources
              .map((relatedResource) =>
                declineNoun(relatedResource, {
                  case: GrammaticalCase.Nominative,
                  plural: true,
                }),
              )
              .join(" i "),
          )} ${clickedDayFormatted}`
      : `${toTitleCase(
          declineNoun(resource, {
            case: GrammaticalCase.Nominative,
            plural: true,
          }),
        )} ${clickedDayFormatted}`;
  }
}
