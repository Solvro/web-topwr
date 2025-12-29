"use client";

import { SquarePen } from "lucide-react";
import type { ReactNode } from "react";

import type {
  ArfSheetContextType,
  ArfSheetFormProps,
} from "@/features/abstract-resource-form/types";
import type { Resource } from "@/features/resources";
import {
  DeleteButtonWithDialog,
  OpenCreateSheetButton,
} from "@/features/resources";
import type {
  ResourceDataType,
  ResourceRelation,
} from "@/features/resources/types";

export function SheetCard<T extends Resource, L extends ResourceRelation<T>>({
  resource,
  event,
  sheet,
  clickable,
  formProps,
  parentResourceData,
  children,
}: {
  resource: ResourceRelation<T>;
  event: ResourceDataType<L>;
  clickable: boolean;
  parentResourceData: ResourceDataType<T>;
  sheet: ArfSheetContextType<T>;
  formProps: ArfSheetFormProps<L>;
  children?: ReactNode;
}) {
  return (
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      {children}
      {clickable ? (
        <div className="flex items-center gap-2">
          <OpenCreateSheetButton
            sheet={sheet}
            resource={resource}
            parentResourceData={parentResourceData}
            formProps={formProps}
            edit
          >
            <SquarePen />
          </OpenCreateSheetButton>
          <DeleteButtonWithDialog resource={resource} id={event.id} />
        </div>
      ) : null}
    </article>
  );
}
