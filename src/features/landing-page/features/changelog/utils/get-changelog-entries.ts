import type { Resource } from "@/features/resources";
import { ChangeType } from "@/features/resources/enums";
import type { ResourceDataWithRelations } from "@/features/resources/types";

import { MAX_CHANGELOG_ENTRIES } from "../constants";
import type { ChangelogEntry } from "../types";

/** If version has no release date, guess what it should be */
const getReleaseDate = (
  version: ResourceDataWithRelations<Resource.Versions>,
) => version.releaseDate || version.createdAt;

export function getChangelogEntries(
  versions: ResourceDataWithRelations<Resource.Versions>[],
): ChangelogEntry[] {
  return versions
    .toSorted(
      (first, second) =>
        new Date(getReleaseDate(second)).getTime() -
        new Date(getReleaseDate(first)).getTime(),
    )
    .flatMap((version) =>
      version.changes
        .filter((change) => change.type === ChangeType.Feature)
        .map((change) => ({
          id: change.id,
          name: change.name,
          description: change.description,
          versionName: version.name,
          releaseDate: getReleaseDate(version),
        })),
    )
    .slice(0, MAX_CHANGELOG_ENTRIES);
}
