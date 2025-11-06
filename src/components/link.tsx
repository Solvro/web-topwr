"use client";

import type { Route } from "next";
import NextLink from "next/link";
import type { LinkProps } from "next/link";
import { useTopLoader } from "nextjs-toploader";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function Link<T>(props: LinkProps<T>) {
  const { hasUnsavedChanges, showConfirmDialog } = useUnsavedChanges();
  const topLoader = useTopLoader();

  return (
    <NextLink
      onNavigate={(event_) => {
        if (hasUnsavedChanges) {
          showConfirmDialog(props.href as Route);
          event_.preventDefault();
          // This needs to be a timeout, not a microtask, becuase otherwise it tries to stop before it starts
          setTimeout(() => {
            topLoader.done();
          });
        }
      }}
      {...props}
    />
  );
}
