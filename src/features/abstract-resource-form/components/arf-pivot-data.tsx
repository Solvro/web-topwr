"use client";

import type { ComponentProps } from "react";

import { SelectOptions } from "@/components/inputs/select-options";
import { SelectClear } from "@/components/select-clear";
import type { SetOptionSelected } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resource } from "@/config/enums";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { useRouter } from "@/hooks/use-router";
import {
  getResourceMetadata,
  getResourceRelationDefinitions,
  isEmptyValue,
  isUnsetEnumField,
  tryParseNumber,
} from "@/lib/helpers";
import type {
  Id,
  ResourceDataType,
  ResourcePivotRelation,
  ResourcePivotRelationData,
  ResourceRelation,
} from "@/types/app";

import { useArfRelationMutation } from "../hooks/use-arf-relation-mutation";
import { isPivotRelationDefinition } from "../utils/is-pivot-relation-definition";
import { isRelationPivotDefinition } from "../utils/is-relation-pivot-definition";

export function ArfPivotData<
  T extends Resource,
  L extends ResourceRelation<T>,
>({
  resource,
  resourceRelation,
  endpoint,
  queriedRelationData,
  pivotResources,
  optionValue,
  setOptionSelected,
  ...props
}: {
  resource: T;
  resourceRelation: L;
  endpoint: string;
  queriedRelationData: ResourceDataType<L> | undefined;
  pivotResources: ResourcePivotRelationData<T>;
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
  const isPivotRelation = isPivotRelationDefinition<T, L>(relationDefinition);

  if (!isPivotRelation) {
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
      body: {
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

  const pivotData = relationDefinition.pivotData;

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
          label={`Usuń ${declineNoun(resourceRelation, { case: GrammaticalCase.Accusative })}`}
        />
        {isRelationPivotDefinition(pivotData) ? (
          pivotResources[
            pivotData.relatedResource as ResourcePivotRelation<T>
          ].map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {
                getResourceMetadata(pivotData.relatedResource).itemMapper(item)
                  .name
              }
            </SelectItem>
          ))
        ) : (
          <SelectOptions input={pivotData} />
        )}
      </SelectContent>
    </Select>
  );
}
