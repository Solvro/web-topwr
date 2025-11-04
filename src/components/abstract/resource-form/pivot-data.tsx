"use client";

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
  data: ResourceDataType<L>;
  queriedRelationData: ResourceDataType<L> | undefined;
  optionValue: string;
  setOptionSelected: SetOptionSelected;
}) {
  const { mutateRelation } = useArfRelationMutation({
    resource,
    resourceRelation,
    endpoint,
  });

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

  const mutate = async (pivotValueId: Id | null) => {
    setOptionSelected(optionValue, pivotValueId != null);
    return mutateRelation({
      id: optionValue,
      deleted: pivotValueId == null,
      body:
        relationDefinition.pivotData == null
          ? undefined
          : {
              [relationDefinition.pivotData.field]: pivotValueId,
            },
    });
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
        {isRelationPivotDefinition(relationDefinition.pivotData) ? null : (
          <SelectOptions input={relationDefinition.pivotData} />
        )}
      </SelectContent>
    </Select>
  );
}
