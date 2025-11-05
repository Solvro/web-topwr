"use client";

import { useRouter } from "nextjs-toploader/app";

import { SelectOptions } from "@/components/inputs/select-options";
import { SelectClear } from "@/components/select-clear";
import type { SetOptionSelected } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfRelationMutation } from "@/hooks/use-arf-relation-mutation";
import { isRelationPivotDefinition } from "@/lib/abstract-resource-form";
import {
  getResourceRelationDefinitions,
  isUnsetEnumField,
  tryParseNumber,
} from "@/lib/helpers";
import type { Id, ResourceDataType, ResourceRelation } from "@/types/app";

import { PivotRelationOptions } from "./pivot-relation-options";

export function PivotData<T extends Resource, L extends ResourceRelation<T>>({
  resource,
  resourceRelation,
  endpoint,
  queriedRelationData,
  optionValue,
  setOptionSelected,
}: {
  resource: T;
  resourceRelation: L;
  endpoint: string;
  queriedRelationData: ResourceDataType<L> | undefined;
  optionValue: string;
  setOptionSelected: SetOptionSelected;
}) {
  const { mutateRelation } = useArfRelationMutation({
    resource,
    resourceRelation,
    endpoint,
  });

  const router = useRouter();

  const relationDefinitions = getResourceRelationDefinitions(resource);
  const relationDefinition = relationDefinitions[resourceRelation];

  if (
    relationDefinition.type !== RelationType.ManyToMany ||
    relationDefinition.pivotData == null
  ) {
    return null;
  }

  const pivotDataValue =
    queriedRelationData == null
      ? null
      : (queriedRelationData as unknown as { meta: Record<string, Id> }).meta[
          `pivot_${relationDefinition.pivotData.field}`
        ];

  const selectValue = isUnsetEnumField(pivotDataValue)
    ? ""
    : String(pivotDataValue);

  /** Passes the correct arguments to `mutateRelation`. */
  const mutateDirectly = async (pivotValueId: Id | null) =>
    mutateRelation({
      id: optionValue,
      deleted: pivotValueId == null,
      body:
        relationDefinition.pivotData == null
          ? undefined
          : {
              [relationDefinition.pivotData.field]: pivotValueId,
            },
    });

  /** Performs the mutation and updates the client-side state. */
  const mutate = async (pivotValueId: Id | null) => {
    const relationAdded = pivotValueId != null;

    if (relationAdded && !isUnsetEnumField(pivotDataValue)) {
      // remove the old relation first, before adding a new one
      // TODO?: support multiple relations (e.g. a contributor being both PM and UI/UX)
      await mutateDirectly(null);
    }
    setOptionSelected(optionValue, relationAdded);

    try {
      const result = await mutateDirectly(pivotValueId);
      return result;
    } finally {
      router.refresh();
    }
  };

  return (
    <Select
      value={selectValue}
      onValueChange={async (value) => mutate(tryParseNumber(value))}
    >
      <SelectTrigger size="sm">
        <SelectValue placeholder="Dodaj" />
      </SelectTrigger>
      <SelectContent>
        <SelectClear
          label="Usuń"
          value={selectValue}
          onChange={async () => mutate(null)}
        />
        {isRelationPivotDefinition(relationDefinition.pivotData) ? (
          <PivotRelationOptions
            resource={relationDefinition.pivotData.relatedResource}
          />
        ) : (
          <SelectOptions input={relationDefinition.pivotData} />
        )}
      </SelectContent>
    </Select>
  );
}
