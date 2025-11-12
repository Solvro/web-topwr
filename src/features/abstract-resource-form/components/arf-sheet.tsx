"use client";

import type { Dispatch, SetStateAction } from "react";

import { Sheet } from "@/components/ui/sheet";
import type { Resource } from "@/features/resources";

import type { ArfSheetData } from "../types/internal";
import { ArfSheetContent } from "./arf-sheet-content";

export function ArfSheet<T extends Resource>({
  resource,
  sheet,
  setSheet,
}: {
  resource: T;
  sheet: ArfSheetData<T>;
  setSheet: Dispatch<SetStateAction<ArfSheetData<T>>>;
}) {
  const closeSheet = () => {
    setSheet((oldValue) => ({ ...oldValue, visible: false }));
  };
  return (
    <Sheet
      open={sheet.visible}
      onOpenChange={(open) => {
        if (!open && sheet.visible) {
          closeSheet();
        }
      }}
    >
      {sheet.content == null ? null : (
        <ArfSheetContent
          resource={resource}
          content={sheet.content}
          closeSheet={closeSheet}
        />
      )}
    </Sheet>
  );
}
