import type { ReactNode } from "react";

import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { fetchQuery } from "@/features/backend";
import type { GetResourceWithRelationsResponse } from "@/features/backend/types";
import type { RoutableResource } from "@/features/resources/types";

export async function AbstractResourceEditPageInternal({
  resource,
  path,
  errorMessage,
}: {
  resource: RoutableResource;
  path: string;
  errorMessage: ReactNode;
}) {
  let resourceData;
  try {
    const response = await fetchQuery<
      GetResourceWithRelationsResponse<typeof resource>
    >(path, { resource, includeRelations: true });
    resourceData = response.data;
  } catch {
    return (
      <ErrorMessage
        type={ApplicationError.NotFound}
        message={errorMessage}
        returnToResource={resource}
      />
    );
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
