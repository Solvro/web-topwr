"use client";

import { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import type { Control, FieldArray } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources";
import type {
  ArrayResources,
  ResourceFormValues,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import type {
  ArrayInputField,
  ArrayInputOptions,
  FormInputBase,
} from "@/types/forms";

export function ArrayInput<T extends Resource>({
  name,
  control,
  label,
  inputOptions,
  relatedResources,
}: {
  name: ArrayInputField<T>;
  control: Control<ResourceFormValues<T>>;
  inputOptions: ArrayInputOptions;
  relatedResources: ResourceRelations<T>;
} & FormInputBase) {
  type ArrayMember = FieldArray<ResourceFormValues<T>, ArrayInputField<T>>;

  const array = useFieldArray({ control, name });

  const optionNames = useMemo(() => {
    const itemsResourceMetadata = getResourceMetadata(
      inputOptions.itemsResource,
    );
    const items =
      // This cast is safe as ArrayResources<T> derives from ArrayInputOptions["itemsResource"]
      relatedResources[inputOptions.itemsResource as ArrayResources<T>];
    return items.map(
      (item) => itemsResourceMetadata.itemMapper(item).name ?? String(item.id),
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
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              animationConfig={{
                badgeAnimation: "none",
              }}
              options={multiSelectOptions}
              onOptionToggled={(value) => {
                const itemIndex = array.fields.findIndex(
                  ({ id, ...item }) => Object.values(item).join("") === value,
                );
                if (itemIndex === -1) {
                  // This cast shouldn't be necessary but I think the types don't match due to how react-hook-form types its FieldArray
                  // `name` is typed to be a path to a field which corresponds to an array of strings, so this cast is safe
                  array.append(value as ArrayMember);
                } else {
                  array.remove(itemIndex);
                }
              }}
              onValueChange={(values) => {
                if (values.length === 0) {
                  array.remove();
                } else {
                  array.replace(optionNames as ArrayMember[]);
                }
              }}
              placeholder={`Wybierz ${label.toLowerCase()}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
