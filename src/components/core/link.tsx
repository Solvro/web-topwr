"use client";

import { Link as TransitionLink } from "@solvro/next-view-transitions";
import type { Route } from "next";
import type { LinkProps } from "next/link";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function Link<T extends string>({
  href,
  ...rest
}: LinkProps<T> & { href: Route<T> }) {
  const { hasUnsavedChanges, showConfirmDialog } = useUnsavedChanges();

  return (
    <TransitionLink
      href={href as LinkProps<T>["href"]}
      onClick={(event_) => {
        if (!hasUnsavedChanges) {
          return;
        }
        showConfirmDialog(href as Route);
        event_.preventDefault();
      }}
      {...rest}
    />
  );
}
