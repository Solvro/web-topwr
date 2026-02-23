import { fetchRelatedResources } from "@/features/abstract-resource-form";
import { typedFromEntries } from "@/utils";

import { fetchDrafts } from "../api/fetch-drafts";
import type { DraftableResourceRelationMap } from "../types/internal";
import { getDraftResource } from "../utils/get-draft-resource";
import { DraftItem } from "./draft-item";

export async function ReviewList() {
  const data = await fetchDrafts();
  const drafts = data.map((draft) => ({
    ...draft,
    resource: getDraftResource(draft),
  }));
  const resources = new Set(drafts.map((draft) => draft.resource));
  const relatedResourcesMap: DraftableResourceRelationMap = typedFromEntries(
    await Promise.all(
      [...resources].map(async (resource) => [
        resource,
        await fetchRelatedResources(resource),
      ]),
    ),
  );
  return (
    <div>
      {drafts.map((draft) => (
        <DraftItem
          key={`draft-item-${String(draft.data.id)}`}
          draft={draft}
          relatedResourcesMap={relatedResourcesMap}
        />
      ))}
    </div>
  );
}
