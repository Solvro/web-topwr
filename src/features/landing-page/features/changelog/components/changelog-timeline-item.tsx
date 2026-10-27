"use client";

import { motion } from "motion/react";
import { useFormatter } from "next-intl";

import { VIEWPORT_OFFSET } from "@/features/landing-page/constants";

import { TIMELINE_ITEM_WIDTH } from "../constants";
import type { ChangelogEntry } from "../types";

export function ChangelogTimelineItem({
  entry,
  index,
}: {
  entry: ChangelogEntry;
  index: number;
}) {
  const format = useFormatter();

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
      <div className="border-border bg-card mt-6 mr-8 mb-2 flex flex-1 flex-col gap-2 rounded-2xl border p-5">
        <p className="text-muted-foreground font-mono text-xs capitalize">
          {format.dateTime(new Date(entry.releaseDate), {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h4 className="text-lg font-semibold tracking-tight">{entry.name}</h4>
        {entry.description == null ? null : (
          <p className="text-muted-foreground text-sm">{entry.description}</p>
        )}
      </div>
    </motion.li>
  );
}
