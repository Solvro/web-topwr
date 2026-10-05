import { fetchResources } from "@/features/backend";
import { Resource } from "@/features/resources";

import { getChangelogEntries } from "../utils/get-changelog-entries";
import { ChangelogTimeline } from "./changelog-timeline";

export async function Changelog() {
  const versions = await fetchResources(Resource.Versions, true);
  const entries = getChangelogEntries(versions);

  return (
    <article className="flex w-full flex-col items-center justify-center py-20">
      <div className="container flex max-w-6xl flex-col px-4 md:px-6">
        <h2 className="mb-4 text-4xl font-medium sm:text-5xl">Changelog</h2>
        <p className="text-muted-foreground mb-12 max-w-md text-lg">
          Śledź, co nowego pojawia się w ToPWR z każdą aktualizacją.
        </p>

        <ChangelogTimeline entries={entries} />
      </div>
    </article>
  );
}
