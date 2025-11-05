"use client";

import { useRouter } from "nextjs-toploader/app";
import type { ComponentProps } from "react";

import { SelectOptions } from "@/components/inputs/select-options";
import { SelectClear } from "@/components/select-clear";
import type { SetOptionSelected } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeclensionCase, RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfRelationMutation } from "@/hooks/use-arf-relation-mutation";
import { isRelationPivotDefinition } from "@/lib/abstract-resource-form";
import {
  getResourceRelationDefinitions,
  isEmptyValue,
  isUnsetEnumField,
  tryParseNumber,
} from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { Id, ResourceDataType, ResourceRelation } from "@/types/app";

import { PivotRelationOptions } from "./pivot-relation-options";

export function PivotData<T extends Resource, L extends ResourceRelation<T>>({
  resource,
  resourceRelation,
  endpoint,
  queriedRelationData,
  optionValue,
  setOptionSelected,
  ...props
}: {
  resource: T;
  resourceRelation: L;
  endpoint: string;
  queriedRelationData: ResourceDataType<L> | undefined;
  optionValue: string;
  setOptionSelected: SetOptionSelected;
} & ComponentProps<typeof SelectTrigger>) {
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
    const relationAdded = !isEmptyValue(pivotValueId);

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
      <SelectTrigger size="sm" {...props}>
        <SelectValue placeholder="Dodaj" />
      </SelectTrigger>
      <SelectContent>
        <SelectClear
          value={selectValue}
          label={`Usuń ${declineNoun(resourceRelation, { case: DeclensionCase.Accusative })}`}
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
