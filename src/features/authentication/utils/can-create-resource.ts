import type { Resource } from "@/features/resources";

import type { User } from "../types/internal";
import { canSuggestNewResource } from "./can-suggest-new-resource";
import { isSolvroAdmin } from "./is-solvro-admin";

/** Whether the user can create the given resource, either directly or by submitting a draft. */
export const canCreateResource = (user: User | null, resource: Resource) =>
  isSolvroAdmin(user) || canSuggestNewResource(user, resource);
