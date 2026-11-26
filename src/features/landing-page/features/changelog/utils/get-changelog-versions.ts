import type { ChangelogEntry, ChangelogVersion } from "../types";

export function getChangelogVersions(
  entries: ChangelogEntry[],
): ChangelogVersion[] {
  return Array.from(
    Map.groupBy(entries, (entry) => entry.versionName),
    ([name, versionEntries]) => ({ name, entries: versionEntries }),
  );
}
