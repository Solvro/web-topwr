"use client";

import { Link as TransitionLink } from "@solvro/next-view-transitions";
import type { Route } from "next";
import type { LinkProps } from "next/link";
import { useTopLoader } from "nextjs-toploader";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function Link<T extends string>(
  props: LinkProps<T> & { href: Route<T> },
) {
  const { hasUnsavedChanges, showConfirmDialog } = useUnsavedChanges();
  const topLoader = useTopLoader();

  return (
    <TransitionLink
      onClick={(event_) => {
        if (!hasUnsavedChanges) {
          return;
        }
        showConfirmDialog(props.href as Route<T>);
        event_.preventDefault();
        // This needs to be a timeout, not a microtask, because otherwise it tries to stop before it starts
        setTimeout(() => {
          topLoader.done();
        });
      }}
      {...props}
    />
  );
}
