import { Resource } from "@/features/resources";

import type { DraftableResource } from "../types/internal";

export const DRAFT_TYPE_RESOURCES = {
  article_draft: Resource.GuideArticles,
  organization_draft: Resource.StudentOrganizations,
} as const satisfies Record<string, DraftableResource>;
