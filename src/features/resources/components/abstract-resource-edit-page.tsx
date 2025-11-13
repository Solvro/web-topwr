import { ErrorMessage } from "@/components/presentation/error-message";
import { Badge } from "@/components/ui/badge";
import { ApplicationError } from "@/config/enums";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { getResourceMetadata } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { ResourceEditPageProps } from "@/types/components";
import { sanitizeId } from "@/utils";

import { AbstractResourceEditPageInternal } from "./abstract-resource-edit-page-internal";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: RoutableResource;
}) {
  const metadata = getResourceMetadata(resource);
  const declensions = declineNoun(resource);

  if (metadata.isSingleton === true) {
    return (
      <AbstractResourceEditPageInternal
        resource={resource}
        path=""
        errorMessage={<>Nie udało się wczytać {declensions.genitive}.</>}
      />
    );
  }
  const { id } = await params;
  if (id == null) {
    console.error(
      "Missing id parameter for non-singleton resource edit page:",
      resource,
    );
    return (
      <ErrorMessage
        type={ApplicationError.ServerError}
        message={`Brak identyfikatora dla ${declensions.genitive}`}
        returnToResource={resource}
      />
    );
  }
  const sanitizedId = sanitizeId(id);

  return (
    <AbstractResourceEditPageInternal
      resource={resource}
      path={sanitizedId}
      errorMessage={
        <>
          Nie istnieje{" "}
          {declineNoun(resource, { case: GrammaticalCase.Nominative })} z
          identyfikatorem <Badge>{sanitizedId}</Badge>.
        </>
      }
    />
  );
}
