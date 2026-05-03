import { fetchRelatedResources } from "@/features/abstract-resource-form";
import { getAuthStateServer } from "@/features/authentication/server";
import { typedFromEntries } from "@/utils";

import { fetchDrafts } from "../api/fetch-drafts";
import type { DraftableResourceRelationMap } from "../types/internal";
import { getDraftResource } from "../utils/get-draft-resource";
import { DraftItem } from "./draft-item";

export async function DraftList() {
  const [drafts, authState] = await Promise.all([
    fetchDrafts(),
    getAuthStateServer(),
  ]);

  if (authState == null) {
    return null;
  }

  const resources = new Set(drafts.map((draft) => getDraftResource(draft)));
  const relatedResourcesMap: DraftableResourceRelationMap = typedFromEntries(
    await Promise.all(
      [...resources].map(async (resource) => [
        resource,
        await fetchRelatedResources(resource),
      ]),
    ),
  );

  if (drafts.length === 0) {
    return (
      <p className="text-muted-foreground w-full text-center">Brak draftów</p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {drafts.map((draft) => (
        <DraftItem
          key={`draft-item-${String(draft.data.id)}`}
          draft={draft}
          relatedResourcesMap={relatedResourcesMap}
          authState={authState}
        />
      ))}
    </ul>
  );
}
