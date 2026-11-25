import { ChevronsLeft } from "lucide-react";

import { ReturnButton } from "@/components/presentation/return-button";
import { fetchRelatedResources } from "@/features/abstract-resource-form";
import { getAuthStateServer } from "@/features/authentication/server";
import { Resource } from "@/features/resources";
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

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="grow basis-0 overflow-y-auto pr-2">
        {drafts.length === 0 ? (
          <p className="text-muted-foreground w-full text-center">
            Brak draftów
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {drafts.map((draft) => (
              <DraftItem
                key={`draft-item-${getDraftResource(draft)}-${String(draft.data.id)}`}
                draft={draft}
                relatedResourcesMap={relatedResourcesMap}
                user={authState.user}
              />
            ))}
          </ul>
        )}
      </div>
      <footer className="mt-2 flex w-full flex-col items-center gap-2 sm:flex-row">
        <ReturnButton resource={Resource.Dashboard} icon={ChevronsLeft} />
      </footer>
    </section>
  );
}
