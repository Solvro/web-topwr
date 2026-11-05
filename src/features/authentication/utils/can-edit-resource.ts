import type { Resource } from "@/features/resources";
import type { ResourcePk } from "@/features/resources/types";

import type { User } from "../types/internal";
import { canSuggestResourceEdit } from "./can-suggest-resource-edit";
import { isSolvroAdmin } from "./is-solvro-admin";

/** Whether the user can edit the given resource instance, either directly or by submitting a draft. */
export const canEditResource = (
  user: User | null,
  resource: Resource,
  id: ResourcePk,
) => isSolvroAdmin(user) || canSuggestResourceEdit(user, resource, id);
