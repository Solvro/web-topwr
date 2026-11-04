import { getTranslations } from "next-intl/server";

import { fetchResources } from "@/features/backend";
import { SectionHeader } from "@/features/landing-page/components";
import { Resource } from "@/features/resources";

import { getChangelogEntries } from "../utils/get-changelog-entries";
import { ChangelogTimeline } from "./changelog-timeline";

export async function Changelog() {
  const t = await getTranslations("Changelog");
  const versions = await fetchResources(Resource.Versions, true);
  const entries = getChangelogEntries(versions);

  return (
    <article className="border-border bg-accent dark:bg-accent/25 flex w-full flex-col items-center justify-center border-y py-20">
      <div className="container flex flex-col px-4">
        <SectionHeader title={t("title")} description={t("description")} />

        <ChangelogTimeline entries={entries} />
      </div>
    </article>
  );
}
