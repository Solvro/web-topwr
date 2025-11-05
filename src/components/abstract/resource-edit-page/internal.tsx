import type { ReactNode } from "react";

import { ApplicationError } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { RoutableResource } from "@/types/app";

import { ErrorMessage } from "../../error-message";
import { AbstractResourceForm } from "../resource-form";

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
