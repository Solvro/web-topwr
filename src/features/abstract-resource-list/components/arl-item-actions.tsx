"use client";

import type { ReactNode } from "react";

import {
  canEditResource,
  isSolvroAdmin,
  useCurrentUser,
} from "@/features/authentication";
import { EditButton } from "@/features/resources";
import type { EditableResource, ResourcePk } from "@/features/resources/types";

/** Default list item actions, shown according to the current user's permissions. */
export function ArlItemActions({
  resource,
  id,
  toggleStatusButton,
}: {
  resource: EditableResource;
  id: ResourcePk;
  toggleStatusButton?: ReactNode;
}) {
  const user = useCurrentUser();
  return (
    <>
      {canEditResource(user, resource, id) ? (
        <EditButton resource={resource} id={id} />
      ) : null}
      {isSolvroAdmin(user) ? toggleStatusButton : null}
    </>
  );
}
