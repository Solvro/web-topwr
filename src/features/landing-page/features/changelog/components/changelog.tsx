import { fetchResources } from "@/features/backend";
import { SectionHeader } from "@/features/landing-page/components";
import { Resource } from "@/features/resources";

import { getChangelogEntries } from "../utils/get-changelog-entries";
import { ChangelogTimeline } from "./changelog-timeline";

export async function Changelog() {
  const versions = await fetchResources(Resource.Versions, true);
  const entries = getChangelogEntries(versions);

  return (
    <article className="flex w-full flex-col items-center justify-center py-20">
      <div className="container flex max-w-6xl flex-col px-4 md:px-6">
        <SectionHeader
          title="Changelog"
          description="Śledź, co nowego pojawia się w ToPWR z każdą aktualizacją."
        />

        <ChangelogTimeline entries={entries} />
      </div>
    </article>
  );
}
