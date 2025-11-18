"use client";

import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { ArfSheetContextType } from "@/features/abstract-resource-form/types";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceRelation,
} from "@/features/resources/types";

export function OpenCreateSheetButton<T extends Resource>({
  sheet,
  resource,
  parentResourceData,
}: {
  sheet: ArfSheetContextType<T>;
  resource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
}) {
  return (
    <Button
      variant="outline"
      className="flex-1"
      onClick={() => {
        sheet.showSheet(
          {
            item: null,
            childResource: resource,
            parentResourceData,
          },
          {
            resource,
            className: "w-full px-4",
          },
        );
      }}
    >
      Dodaj{" "}
      {declineNoun(resource, {
        case: GrammaticalCase.Nominative,
        plural: false,
      })}
    </Button>
  );
}
