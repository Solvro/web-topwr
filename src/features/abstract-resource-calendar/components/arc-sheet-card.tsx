"use client";

import { SquarePen } from "lucide-react";
import type { ReactNode } from "react";

import type { ArfSheetContextType } from "@/features/abstract-resource-form/types";
import {
  DeleteButtonWithDialog,
  OpenCreateSheetButton,
  Resource,
} from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

export function SheetCard({
  event,
  sheet,
  clickable,
  formProps,
  parentResourceData,
  children,
  iconOnly = false,
}: {
  event: ResourceDataType<Resource>;
  clickable: boolean;
  parentResourceData: ResourceDataType<Resource>;
  sheet: ArfSheetContextType<Resource>;
  formProps: ResourceFormProps<Resource> & ResourceDefaultValues<Resource>;
  children?: ReactNode;
  iconOnly?: boolean;
}) {
  return (
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      {children}
      {clickable ? (
        <div className="flex items-center gap-2">
          <OpenCreateSheetButton
            className="h-10 w-10"
            sheet={sheet}
            resource={Resource.Holidays}
            parentResourceData={parentResourceData}
            formProps={formProps}
            iconOnly={iconOnly}
          >
            <SquarePen />
          </OpenCreateSheetButton>
          <DeleteButtonWithDialog resource={Resource.Holidays} id={event.id} />
        </div>
      ) : null}
    </article>
  );
}
