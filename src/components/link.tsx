"use client";

import NextLink from "next/link";
import { useTopLoader } from "nextjs-toploader";
import type { ComponentProps } from "react";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function Link(props: ComponentProps<typeof NextLink>) {
  const { hasUnsavedChanges, showConfirmDialog } = useUnsavedChanges();
  const topLoader = useTopLoader();

  return (
    <NextLink
      onNavigate={(event_) => {
        if (hasUnsavedChanges) {
          showConfirmDialog(props.href);
          event_.preventDefault();
          setTimeout(() => {
            topLoader.done();
          });
        }
      }}
      {...props}
    />
  );
}
