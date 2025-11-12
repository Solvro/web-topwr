"use client";

import type { Control } from "react-hook-form";

import { ArrayInput } from "@/components/inputs/array-input";
import { CheckboxInput } from "@/components/inputs/checkbox-input";
import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { Inputs } from "@/components/inputs/input-row";
import { SelectInput } from "@/components/inputs/select-input";
import { SelectOptions } from "@/components/inputs/select-options";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Textarea } from "@/components/ui/textarea";
import type { Resource } from "@/config/enums";
import { getResourceMetadata } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type {
  RelationDefinition,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  ResourceRelation,
} from "@/types/app";
import type { ExistingImages, ResourceRelations } from "@/types/components";

import { useArfRelation } from "../hooks/use-arf-relation";
import { ArfRelationInput } from "./arf-relation-input";

export function ArfInputs<T extends Resource>({
  resource,
  control,
  defaultValues,
  existingImages,
  relatedResources,
  pivotResources,
}: {
  resource: T;
  control: Control<ResourceFormValues<T>>;
  defaultValues: ResourceDefaultValues<T>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
  pivotResources: ResourcePivotRelationData<T>;
}) {
  const relationContext = useArfRelation();

  const metadata = getResourceMetadata(resource);
  const isEmbedded = relationContext != null;

  const {
    imageInputs,
    textInputs,
    textareaInputs,
    richTextInputs,
    dateInputs,
    dateTimeInputs,
    colorInputs,
    selectInputs,
    checkboxInputs,
    arrayInputs,
    relationInputs,
  } = metadata.form.inputs;

  return (
    <div className="grow basis-0 overflow-y-auto">
      <div
        className={cn(
          "bg-accent text-accent-foreground flex min-h-full flex-col gap-4 rounded-xl p-4",
          { "md:flex-row": !isEmbedded },
        )}
      >
        <Inputs
          container
          className="flex-col flex-nowrap"
          inputs={imageInputs}
          mapper={([name, input]) => (
            <FormField
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    {...field}
                    value={(field.value ?? null) as string | null}
                    {...input}
                    existingImage={existingImages[field.name]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
        <div className="w-full space-y-4">
          <Inputs
            inputs={textInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wpisz tekst..."
                        {...field}
                        value={(field.value ?? "") as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            inputs={textareaInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Wpisz tekst..."
                        {...field}
                        value={(field.value ?? "") as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            container
            inputs={dateInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <DatePicker
                      {...field}
                      value={field.value as string | null}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            inputs={dateTimeInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value as string | null}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            inputs={richTextInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        // @ts-expect-error types not matching
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        editorContentClassName="p-4"
                        placeholder="Wpisz opis..."
                        aria-label={input.label}
                        editable
                        output="html"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            container
            inputs={colorInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <ColorInput
                        {...field}
                        value={field.value as string | null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
          <Inputs
            container
            inputs={checkboxInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <CheckboxInput
                    value={(field.value ?? false) as boolean}
                    label={input.label}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          />
          <Inputs
            container
            inputs={arrayInputs}
            mapper={([name, { label, ...options }]) => (
              <ArrayInput
                key={name}
                control={control}
                name={name}
                label={label}
                inputOptions={options}
                relatedResources={relatedResources}
              />
            )}
          />
          {selectInputs == null && relationInputs == null ? null : (
            <div
              className={cn("grid grid-cols-1 items-start gap-4", {
                "lg:grid-cols-2": !isEmbedded,
              })}
            >
              <Inputs
                inputs={selectInputs}
                mapper={([name, input]) => (
                  <SelectInput
                    key={name}
                    control={control}
                    name={name}
                    label={input.label}
                    options={<SelectOptions input={input} />}
                  />
                )}
              />
              <Inputs
                inputs={relationInputs}
                mapper={([
                  untypedResourceRelation,
                  untypedRelationDefinition,
                ]) => {
                  // these type assertions are needed because the values are extracted from RESOURCE_METADATA
                  // the types are inferred from the structure of RESOURCE_METADATA, so they are fundamentally equivalent
                  const resourceRelation =
                    untypedResourceRelation as ResourceRelation<T>;
                  const relationDefinition =
                    untypedRelationDefinition as RelationDefinition<
                      T,
                      typeof resourceRelation
                    >;
                  return (
                    <ArfRelationInput
                      key={`${resource}-multiselect-${resourceRelation}`}
                      resource={resource}
                      resourceRelation={resourceRelation}
                      relationDefinition={relationDefinition}
                      relatedResources={relatedResources}
                      pivotResources={pivotResources}
                      control={control}
                      defaultValues={defaultValues}
                    />
                  );
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
