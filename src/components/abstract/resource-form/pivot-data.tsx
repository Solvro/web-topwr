"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfRelationMutation } from "@/hooks/use-arf-relation-mutation";
import {
  getResourceRelationDefinitions,
  isUnsetEnumField,
  tryParseNumber,
} from "@/lib/helpers";
import type {
  Id,
  PivotDataDefinition,
  ResourceDataType,
  ResourceRelation,
} from "@/types/app";

const constructPivotData = (definition: PivotDataDefinition | undefined) => {
  if (definition == null) {
    return {};
  }
  return {
    // TODO: populate field
    [definition.field]: null,
  };
};

export function PivotData<T extends Resource, L extends ResourceRelation<T>>({
  resource,
  resourceRelation,
  endpoint,
  data,
  optionValue,
  toggleOption,
}: {
  resource: T;
  resourceRelation: L;
  endpoint: string;
  data: ResourceDataType<L>;
  optionValue: string;
  toggleOption: (optionValue: string) => void;
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

  const mutate = async (pivotValueId: Id | null) => {
    // TODO: figure out when this is supposed to be called, this is a placeholder condition
    if (pivotValueId == null) {
      toggleOption(optionValue);
    }
    return mutateRelation({
      id: optionValue,
      deleted: pivotValueId != null,
      body: constructPivotData(relationDefinition.pivotData),
    });
  };

  const pivotDataValue = (data as unknown as { meta: Record<string, Id> }).meta[
    `pivot_${relationDefinition.pivotData.field}`
  ];

  return (
    <Select
      value={isUnsetEnumField(pivotDataValue) ? "" : String(pivotDataValue)}
      onValueChange={async (value) => mutate(tryParseNumber(value))}
    >
      <SelectTrigger size="sm">
        <SelectValue placeholder="Dodaj" />
      </SelectTrigger>
      <SelectContent>{}</SelectContent>
    </Select>
  );
}
