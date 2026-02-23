import { Resource } from "@/features/resources";

import type { DraftableResource } from "../types/internal";

export const RESOURCE_DRAFT_TYPES = {
  [Resource.GuideArticles]: "article_draft",
  [Resource.StudentOrganizations]: "organization_draft",
} as const satisfies Record<DraftableResource, string>;
