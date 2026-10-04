"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import type { AppFeature } from "../types";

export function AppFeatureListItem({
  feature,
  isActive,
  onSelect,
}: {
  feature: AppFeature;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = feature.icon;

  return (
    <li className="relative">
      {isActive ? (
        <motion.span
          layoutId="active-app-feature-indicator"
          className="bg-primary absolute inset-y-0 -left-px w-0.5 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive}
        className={cn(
          "flex w-full cursor-pointer items-start gap-3 py-2 pl-5 text-left transition-opacity duration-300 md:gap-4 md:py-3 md:pl-6",
          isActive ? "opacity-100" : "opacity-40 hover:opacity-70",
        )}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.95_0.05_var(--feature-hue))] text-[oklch(0.55_0.17_var(--feature-hue))] md:size-10 dark:bg-[oklch(0.28_0.06_var(--feature-hue))] dark:text-[oklch(0.78_0.14_var(--feature-hue))]"
          style={{ "--feature-hue": feature.hue }}
        >
          <Icon className="size-5" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-semibold md:text-lg">{feature.title}</span>
          <span
            className={cn(
              "text-muted-foreground text-sm md:block",
              isActive ? "block" : "hidden",
            )}
          >
            {feature.description}
          </span>
        </span>
      </button>
    </li>
  );
}
