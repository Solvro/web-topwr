import type { ReactNode } from "react";

import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { getAuthStateServer } from "@/features/authentication/server";
import { fetchQuery } from "@/features/backend";
import type { GetResourceWithRelationsResponse } from "@/features/backend/types";

import type { RoutableResource } from "../types";

export async function AbstractResourceEditPageInternal({
  resource,
  path,
  draft = false,
  errorMessage,
}: {
  resource: RoutableResource;
  path: string;
  draft?: boolean;
  errorMessage: ReactNode;
}) {
  const authState = await getAuthStateServer();
  let resourceData;
  try {
    const response = await fetchQuery<
      GetResourceWithRelationsResponse<typeof resource>
    >(path, {
      resource,
      includeRelations: true,
      draft,
      accessTokenOverride: authState?.accessToken,
    });
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
    <AbstractResourceForm
      resource={resource}
      defaultValues={resourceData}
      draft={draft}
    />
  );
}
