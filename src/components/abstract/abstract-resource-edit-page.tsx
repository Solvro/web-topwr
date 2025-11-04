import { Badge } from "@/components/ui/badge";
import { ApplicationError, DeclensionCase } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { RoutableResource } from "@/types/app";
import type { ResourceEditPageProps } from "@/types/components";

import { ErrorMessage } from "../error-message";
import { AbstractResourceForm } from "./resource-form";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: RoutableResource;
}) {
  const { id } = await params;
  let resourceData;
  try {
    const response = await fetchQuery<
      GetResourceWithRelationsResponse<typeof resource>
    >(sanitizeId(id), { resource, includeRelations: true });
    resourceData = response.data;
  } catch {
    return (
      <ErrorMessage
        type={ApplicationError.NotFound}
        message={
          <>
            Nie istnieje{" "}
            {declineNoun(resource, { case: DeclensionCase.Nominative })} z
            identyfikatorem <Badge>{id}</Badge>.
          </>
        }
        returnToResource={resource}
      />
    );
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
