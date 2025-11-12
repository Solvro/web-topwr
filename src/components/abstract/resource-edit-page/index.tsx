import { ErrorMessage } from "@/components/error-message";
import { Badge } from "@/components/ui/badge";
import { ApplicationError, GrammaticalCase } from "@/config/enums";
import { getResourceMetadata, sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";
import type { ResourceEditPageProps } from "@/types/components";

import { AbstractResourceEditPageInternal } from "./internal";

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
