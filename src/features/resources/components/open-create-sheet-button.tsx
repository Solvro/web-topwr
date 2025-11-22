"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { ArfSheetContextType } from "@/features/abstract-resource-form/types";
import { GrammaticalCase, declineNoun } from "@/features/polish";
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
  plural,
  children,
}: {
  sheet: ArfSheetContextType<T>;
  resource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
  formProps: ResourceFormProps<T>;
  plural?: boolean;
  children?: ReactNode;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
    plural,
  });
  return (
    <Button
      resource={resource}
      variant="outline"
      className="flex-1"
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
    >
      Dodaj {resourceAccusative}
      {children}
    </Button>
  );
}
