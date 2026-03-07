"use client";

import { useMemo } from "react";
import type { ComponentProps } from "react";

import { MultiSelect } from "@/components/ui/multi-select";
import type { ArrayInputOptions } from "@/features/abstract-resource-form/types";
import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources";
import type { ArrayResources } from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

export function ArrayInput<T extends Resource>({
  value,
  onChange,
  label,
  inputOptions,
  relatedResources,
  ...props
}: Partial<ComponentProps<typeof MultiSelect>> & {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  inputOptions: ArrayInputOptions;
  relatedResources: ResourceRelations<T>;
}) {
  const optionNames = useMemo(() => {
    const itemsResourceMetadata = getResourceMetadata(
      inputOptions.itemsResource,
    );
    const items =
      // This cast is safe as ArrayResources<T> derives from ArrayInputOptions["itemsResource"]
      relatedResources[inputOptions.itemsResource as ArrayResources<T>];

    return items
      .filter((item) => {
        if (inputOptions.itemFilter == null) {
          return true;
        }
        return inputOptions.itemFilter(item);
      })
      .map(
        (item) =>
          itemsResourceMetadata.itemMapper(item).name ?? String(item.id),
      );
  }, [relatedResources, inputOptions]);

  const multiSelectOptions = useMemo(
    () =>
      optionNames.map((optionName) => ({
        value: optionName,
        label: optionName,
      })),
    [optionNames],
  );

  return (
    <MultiSelect
      animationConfig={{
        badgeAnimation: "none",
      }}
      options={multiSelectOptions}
      defaultValue={value}
      onOptionToggled={(optionValue) => {
        const currentValues = [...(value as string[])];
        const itemIndex = currentValues.indexOf(optionValue);

        if (itemIndex === -1) {
          onChange([...currentValues, optionValue]);
        } else {
          currentValues.splice(itemIndex, 1);
          onChange(currentValues);
        }
      }}
      onValueChange={(values) => {
        onChange(values);
      }}
      placeholder={`Wybierz ${label.toLowerCase()}`}
      {...props}
    />
  );
}
