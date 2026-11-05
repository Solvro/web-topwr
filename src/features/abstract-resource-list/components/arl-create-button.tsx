"use client";

import { canCreateResource, useCurrentUser } from "@/features/authentication";
import { CreateButton } from "@/features/resources";
import type { CreatableResource } from "@/features/resources/types";

/** Create button shown only to users allowed to create the resource, either directly or by submitting a draft. */
export function ArlCreateButton({ resource }: { resource: CreatableResource }) {
  const user = useCurrentUser();
  return canCreateResource(user, resource) ? (
    <CreateButton resource={resource} />
  ) : null;
}
