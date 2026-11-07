"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { ChangelogEntry } from "../types";
import { ChangelogVersionBadge } from "./changelog-version-badge";

export function ChangelogEntryDialog({
  entry,
  releaseDate,
  children,
}: {
  entry: ChangelogEntry;
  releaseDate: string;
  children: ReactNode;
}) {
  const t = useTranslations("Changelog");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/50 backdrop-blur-md" />
        <DialogPrimitive.Content className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:blur-in-sm data-[state=closed]:blur-out-sm fixed inset-0 z-50 m-auto flex h-fit w-[calc(100%-2rem)] max-w-lg flex-col gap-4 rounded-3xl border p-8 shadow-2xl shadow-black/10 duration-250 ease-out outline-none">
          <div className="flex items-center gap-3">
            <ChangelogVersionBadge versionName={entry.versionName} />
            <span className="text-muted-foreground text-[0.625rem]">
              {releaseDate}
            </span>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("close")}
                className="-my-2 -mr-2 ml-auto rounded-full"
              >
                <XIcon />
              </Button>
            </DialogClose>
          </div>
          <DialogTitle className="text-lg leading-snug text-balance">
            {entry.name}
          </DialogTitle>
          <DialogDescription className="text-base whitespace-pre-line">
            {entry.description ?? t("noDescription")}
          </DialogDescription>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
