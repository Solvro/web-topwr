import { ErrorMessage } from "@/components/presentation/error-message";
import { Badge } from "@/components/ui/badge";
import { ApplicationError } from "@/config/enums";
import { logger } from "@/features/logging";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { ResourceEditPageProps } from "@/types/components";
import { sanitizeId } from "@/utils";

import type { RoutableResource } from "../types";
import { getResourceMetadata } from "../utils/get-resource-metadata";
import { AbstractResourceEditPageInternal } from "./abstract-resource-edit-page-internal";

export async function AbstractResourceEditPage({
  resource,
  params,
  draft = false,
}: ResourceEditPageProps & {
  resource: RoutableResource;
  draft?: boolean;
}) {
  const metadata = getResourceMetadata(resource);
  const declensions = declineNoun(resource);

  if (metadata.isSingleton === true) {
    return (
      <AbstractResourceEditPageInternal
        resource={resource}
        path=""
        draft={draft}
        errorMessage={<>Nie udało się wczytać {declensions.genitive}.</>}
      />
    );
  }
  const { id } = await params;
  if (id == null) {
    logger.error(
      { resource },
      "Missing id parameter for non-singleton resource edit page",
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
      draft={draft}
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
