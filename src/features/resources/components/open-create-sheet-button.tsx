"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type {
  ArfSheetContextType,
  ArfSheetFormProps,
} from "@/features/abstract-resource-form/types";
import { getEditButtonProps } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceRelation,
} from "@/features/resources/types";

export function OpenCreateSheetButton<T extends Resource>({
  sheet,
  resource,
  parentResourceData,
  formProps,
  className,
  children,
  edit,
  restrictToOne,
}: {
  sheet: ArfSheetContextType<T>;
  resource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
  formProps: ArfSheetFormProps<ResourceRelation<T>>;
  plural?: boolean;
  className?: string;
  edit?: boolean;
  children: ReactNode;
  restrictToOne?: boolean;
}) {
  const editButtonProps =
    edit == null ? null : { ...getEditButtonProps(resource) };
  const handleClick = () => {
    sheet.showSheet(
      {
        item: null,
        childResource: resource,
        parentResourceData,
      },
      formProps,
    );
  };

  return (
    <Button
      resource={resource}
      variant="outline"
      className={className}
      onClick={handleClick}
      disabled={restrictToOne}
      {...editButtonProps}
    >
      {children}
    </Button>
  );
}
