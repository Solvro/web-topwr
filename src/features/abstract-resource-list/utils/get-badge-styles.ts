/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { cn } from "@/lib/utils";

import type { ItemBadge } from "../types/badges";

const BADGE_BG_OPACITY = 0.12;
const LIGHTNESS_LIGHT = 0.65;
const LIGHTNESS_DARK = 0.93;

export function getBadgeStyles(badge: ItemBadge) {
  if (badge.color == null) {
    return {
      className: "border-muted-foreground text-muted-foreground bg-transparent",
    };
  }

  return {
    className: cn(
      "bg-[var(--color-light-bg)] text-[var(--color-light-text)] border-[var(--color-light-border)]",
      "dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-dark-text)] dark:border-[var(--color-dark-border)]",
    ),
    style: {
      "--badge-base": badge.color,

      "--color-light-text": `oklch(from var(--badge-base) ${LIGHTNESS_LIGHT} c h)`,
      "--color-light-border": `oklch(from var(--badge-base) ${LIGHTNESS_LIGHT} c h)`,
      "--color-light-bg": `oklch(from var(--badge-base) ${LIGHTNESS_LIGHT} c h / ${BADGE_BG_OPACITY})`,

      "--color-dark-text": `oklch(from var(--badge-base) ${LIGHTNESS_DARK} c h)`,
      "--color-dark-border": `oklch(from var(--badge-base) ${LIGHTNESS_DARK} c h)`,
      "--color-dark-bg": `oklch(from var(--badge-base) ${LIGHTNESS_DARK} c h / ${BADGE_BG_OPACITY})`,
    },
  };
}
