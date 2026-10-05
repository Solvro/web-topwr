import type { ChangelogVersion } from "../types";
import { ChangelogTimelineItem } from "./changelog-timeline-item";

export function ChangelogTimelineVersion({
  version,
}: {
  version: ChangelogVersion;
}) {
  return (
    <li className="group relative flex shrink-0 flex-col">
      <span
        aria-hidden
        className="border-primary/40 absolute inset-y-0 right-4 border-r border-dashed group-last:hidden"
      />
      <h3 className="text-primary sticky left-0 mr-8 h-8 w-fit font-mono text-xs font-semibold">
        v{version.name}
      </h3>
      <ol className="flex">
        {version.entries.map((entry, index) => (
          <ChangelogTimelineItem key={entry.id} entry={entry} index={index} />
        ))}
      </ol>
    </li>
  );
}
