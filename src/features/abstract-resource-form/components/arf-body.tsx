"use client";

import type { Control } from "react-hook-form";

import { ArrayInput } from "@/components/inputs/array-input";
import { CheckboxInput } from "@/components/inputs/checkbox-input";
import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { RichTextInput } from "@/components/inputs/rich-text-input";
import { SelectInput } from "@/components/inputs/select-input";
import { SelectOptions } from "@/components/inputs/select-options";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources";
import type {
  RelationDefinition,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  ResourceRelation,
} from "@/features/resources/types";
import { cn } from "@/lib/utils";
import type { ExistingImages, ResourceRelations } from "@/types/components";

import { useArfRelation } from "../hooks/use-arf-relation";
import { isExistingItem } from "../utils/is-existing-item";
import { ArfInput } from "./arf-input";
import { ArfInputSet } from "./arf-input-set";
import { ArfRelationInput } from "./arf-relation-input";

/** Contains the body of the Abstract Resource Form, rendering all input fields. */
export function ArfBody<T extends Resource>({
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
  const isEditing = isExistingItem(resource, defaultValues);
  const declensions = declineNoun(resource);

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
        <ArfInputSet
          container
          className="flex-col flex-nowrap"
          inputs={imageInputs}
          mapper={([name, input]) => (
            <FormField
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <ArfInput
                  declensions={declensions}
                  isEditing={isEditing}
                  inputDefinition={input}
                  noControl
                  noLabel
                >
                  <ImageUpload
                    {...field}
                    value={(field.value ?? null) as string | null}
                    {...input}
                    existingImage={existingImages[field.name]}
                  />
                </ArfInput>
              )}
            />
          )}
        />
        <div className="w-full space-y-4">
          <ArfInputSet
            inputs={textInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                  >
                    <Input
                      placeholder="Wpisz tekst..."
                      {...field}
                      value={(field.value ?? "") as string}
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            inputs={textareaInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                  >
                    <Textarea
                      placeholder="Wpisz tekst..."
                      {...field}
                      value={(field.value ?? "") as string}
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            container
            inputs={dateInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                    noControl
                  >
                    <DatePicker
                      {...field}
                      value={field.value as string | null}
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            inputs={dateTimeInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                    noControl
                  >
                    <DateTimePicker
                      value={field.value as string | null}
                      onChange={field.onChange}
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            inputs={richTextInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                  >
                    <RichTextInput
                      {...field}
                      // @ts-expect-error types not matching
                      value={field.value ?? ""}
                      placeholder="Wpisz opis..."
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            container
            inputs={colorInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <ArfInput
                    declensions={declensions}
                    isEditing={isEditing}
                    inputDefinition={input}
                  >
                    <ColorInput
                      {...field}
                      value={field.value as string | null}
                    />
                  </ArfInput>
                )}
              />
            )}
          />
          <ArfInputSet
            container
            inputs={checkboxInputs}
            mapper={([name, input]) => (
              <FormField
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  // TODO: allow checkbox inputs to be disabled
                  <CheckboxInput
                    value={(field.value ?? false) as boolean}
                    label={input.label}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          />
          {(selectInputs ?? arrayInputs ?? relationInputs) == null ? null : (
            <div
              className={cn("grid grid-cols-1 items-start gap-4", {
                "lg:grid-cols-2": !isEmbedded,
              })}
            >
              <ArfInputSet
                inputs={selectInputs}
                mapper={([name, input]) => (
                  // TODO: allow select inputs to be disabled
                  <SelectInput
                    key={name}
                    control={control}
                    name={name}
                    label={input.label}
                    options={<SelectOptions input={input} />}
                  />
                )}
              />
              <ArfInputSet
                inputs={arrayInputs}
                mapper={([name, { label, ...options }]) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name}
                    render={() => (
                      <ArfInput
                        declensions={declensions}
                        isEditing={isEditing}
                        inputDefinition={{ label, ...options }}
                      >
                        <ArrayInput
                          control={control}
                          name={name}
                          label={label}
                          inputOptions={options}
                          relatedResources={relatedResources}
                        />
                      </ArfInput>
                    )}
                  ></FormField>
                )}
              />
              <ArfInputSet
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
                    // TODO: allow relation inputs to be disabled
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
