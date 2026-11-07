"use client";

import { motion } from "motion/react";
import { useFormatter } from "next-intl";

import { VIEWPORT_OFFSET } from "@/features/landing-page/constants";

import { RELEASE_DATE_FORMAT, TIMELINE_ITEM_WIDTH } from "../constants";
import type { ChangelogEntry } from "../types";
import { ChangelogEntryDialog } from "./changelog-entry-dialog";

export function ChangelogTimelineItem({
  entry,
  index,
}: {
  entry: ChangelogEntry;
  index: number;
}) {
  const format = useFormatter();
  const releaseDate = format.dateTime(
    new Date(entry.releaseDate),
    RELEASE_DATE_FORMAT,
  );

  return (
    <motion.li
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: VIEWPORT_OFFSET }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
      style={{ width: TIMELINE_ITEM_WIDTH }}
      className="flex shrink-0 snap-start flex-col"
    >
      <div className="flex items-center">
        <span className="border-primary flex size-4 shrink-0 items-center justify-center rounded-full border">
          <span className="bg-primary size-1.5 rounded-full" />
        </span>
        <span className="bg-primary/50 h-px flex-1" />
      </div>
      <ChangelogEntryDialog entry={entry} releaseDate={releaseDate}>
        <button
          type="button"
          className="cursor-target border-border bg-card focus-visible:ring-ring relative mt-6 mr-8 mb-2 flex flex-1 flex-col rounded-2xl border px-5 pt-8 pb-12 outline-none focus-visible:ring-2"
        >
          <span className="m-auto text-center text-lg font-semibold text-balance">
            {entry.name}
          </span>
          <span className="text-muted-foreground absolute inset-x-0 bottom-4 text-center text-[0.625rem]">
            {releaseDate}
          </span>
        </button>
      </ChangelogEntryDialog>
    </motion.li>
  );
}
