import { getTranslations } from "next-intl/server";

import { fetchResources } from "@/features/backend";
import {
  LandingSection,
  LandingSectionDescription,
  LandingSectionHeader,
  LandingSectionTitle,
} from "@/features/landing-page/components";
import { Resource } from "@/features/resources";

import { getChangelogEntries } from "../utils/get-changelog-entries";
import { ChangelogTimeline } from "./changelog-timeline";

export async function Changelog() {
  const t = await getTranslations("Changelog");
  const versions = await fetchResources(Resource.Versions, true);
  const entries = getChangelogEntries(versions);

  return (
    <LandingSection className="border-border bg-accent dark:bg-accent/25 border-y">
      <LandingSectionHeader>
        <LandingSectionTitle text={t("title")} />
        <LandingSectionDescription>
          {t("description")}
        </LandingSectionDescription>
      </LandingSectionHeader>

      <ChangelogTimeline entries={entries} />
    </LandingSection>
  );
}
