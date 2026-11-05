import type { ReactNode } from "react";

import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { mustUseDrafts } from "@/features/authentication";
import { getAuthStateServer } from "@/features/authentication/server";
import { fetchQuery } from "@/features/backend";
import type { GetResourceWithRelationsResponse } from "@/features/backend/types";
import { getDraftEditRoute } from "@/features/review";
import type { DraftableResource } from "@/features/review";
import { fetchOwnDraftOf } from "@/features/review/server";

import type { RoutableResource } from "../types";
import { getResourceMetadata } from "../utils/get-resource-metadata";

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

  let existingDraftHref;
  if (
    !draft &&
    path !== "" &&
    getResourceMetadata(resource).apiDraftPath != null &&
    mustUseDrafts(authState?.user ?? null)
  ) {
    const draftableResource = resource as DraftableResource;
    const existingDraft = await fetchOwnDraftOf(draftableResource, path);
    if (existingDraft != null) {
      existingDraftHref = getDraftEditRoute(
        draftableResource,
        existingDraft.data.id,
      );
    }
  }

  return (
    <AbstractResourceForm
      resource={resource}
      defaultValues={resourceData}
      draft={draft}
      existingDraftHref={existingDraftHref}
    />
  );
}
