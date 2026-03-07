"use client";

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
  const itemsResourceMetadata = getResourceMetadata(inputOptions.itemsResource);
  const items =
    // This cast is safe as ArrayResources<T> derives from ArrayInputOptions["itemsResource"]
    relatedResources[inputOptions.itemsResource as ArrayResources<T>];

  const optionNames = items
    .filter((item) => {
      const name =
        itemsResourceMetadata.itemMapper(item).name ?? String(item.id);
      if (value.includes(name)) {
        return true;
      }
      if (inputOptions.itemFilter == null) {
        return true;
      }
      return inputOptions.itemFilter(item);
    })
    .map(
      (item) => itemsResourceMetadata.itemMapper(item).name ?? String(item.id),
    );

  const multiSelectOptions = optionNames.map((optionName) => ({
    value: optionName,
    label: optionName,
  }));

  return (
    <MultiSelect
      animationConfig={{
        badgeAnimation: "none",
      }}
      options={multiSelectOptions}
      defaultValue={value}
      onValueChange={(values) => {
        onChange(values);
      }}
      placeholder={`Wybierz ${label.toLowerCase()}`}
      {...props}
    />
  );
}
