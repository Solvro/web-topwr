"use client";

import { Link as TransitionLink } from "@solvro/next-view-transitions";
import type { Route } from "next";
import type { LinkProps } from "next/link";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function Link<T extends string>(
  props: LinkProps<T> & { href: Route<T> },
) {
  const { hasUnsavedChanges, showConfirmDialog } = useUnsavedChanges();

  return (
    <TransitionLink
      onClick={(event_) => {
        if (!hasUnsavedChanges) {
          return;
        }
        showConfirmDialog(props.href as Route<T>);
        event_.preventDefault();
      }}
      {...props}
    />
  );
}
