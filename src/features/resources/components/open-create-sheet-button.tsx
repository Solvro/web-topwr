"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { ArfSheetContextType } from "@/features/abstract-resource-form/types";
import { getEditButtonProps } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceRelation,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

export function OpenCreateSheetButton<T extends Resource>({
  sheet,
  resource,
  parentResourceData,
  formProps,
  className,
  children,
  edit,
}: {
  sheet: ArfSheetContextType<T>;
  resource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
  formProps: ResourceFormProps<T>;
  plural?: boolean;
  className?: string;
  edit?: boolean;
  children: ReactNode;
}) {
  const editButtonProps =
    edit === undefined ? null : { ...getEditButtonProps(resource) };
  return (
    <Button
      resource={resource}
      variant="outline"
      className={className}
      onClick={() => {
        sheet.showSheet(
          {
            item: null,
            childResource: resource,
            parentResourceData,
          },
          formProps,
        );
      }}
      {...editButtonProps}
    >
      {children}
    </Button>
  );
}
