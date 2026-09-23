import type { Route } from "next";

import type { ResourcePk } from "@/features/resources/types";
import { sanitizeId } from "@/utils";

import type { DraftableResource } from "../types/internal";

/** Returns the route of the edit page of the given draft. */
export const getDraftEditRoute = (
  resource: DraftableResource,
  id: ResourcePk,
) => `/${resource}/drafts/edit/${sanitizeId(id)}` as Route;

/** Returns the route of the draft list suitable for the given user. */
export const getDraftListRoute = (canManageAllDrafts: boolean) =>
  canManageAllDrafts ? ("/review" as const) : ("/drafts" as const);
