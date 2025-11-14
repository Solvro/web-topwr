import type { ArrayPath } from "react-hook-form";
import type { z } from "zod";

import type { ImageType } from "@/config/enums";
import type { Resource } from "@/features/resources";
import type {
  RelationDefinitions,
  ResourceFormValues,
  ResourceSchemaKey,
} from "@/features/resources/types";

export interface FormInputBase {
  label: string;
}

type FormInput<
  T extends Resource,
  S extends z.ZodTypeAny = z.ZodString,
  P = unknown,
> = Partial<Record<ResourceSchemaKey<T, S>, P & FormInputBase>>;

export interface SelectInputOptions<
  Y extends string | number = string | number,
> {
  optionEnum: Record<string, Y>;
  optionLabels: Record<Y, string>;
}

type FormSelectInputs<T extends Resource> = FormInput<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  z.ZodNativeEnum<any> | z.ZodEnum<any>,
  SelectInputOptions
>;

export type ArrayInputField<T extends Resource> = ArrayPath<
  ResourceFormValues<T>
> &
  ResourceSchemaKey<T, z.ZodArray<z.ZodString>>;

// this can be extended to support other item types in the future
export interface ArrayInputOptions {
  itemsResource: Resource;
}

type ArrayInputs<T extends Resource> = Partial<
  Record<ArrayInputField<T>, FormInputBase & ArrayInputOptions>
>;

export interface AbstractResourceFormInputs<T extends Resource> {
  /** Image upload inputs for image key fields. */
  imageInputs?: FormInput<T, z.ZodString, { type: ImageType }>;
  /** Standard text input fields. */
  textInputs?: FormInput<T>;
  /** Resizable longer text input fields. */
  textareaInputs?: FormInput<T>;
  /** Date input fields, without time. */
  dateInputs?: FormInput<T>;
  /** Date and time input fields. */
  dateTimeInputs?: FormInput<T>;
  /** Rich text editor input for HTML string fields. */
  richTextInputs?: FormInput<T>;
  /** Color picker input fields for HEX string fields. */
  colorInputs?: FormInput<T>;
  /** Select input fields for dropdowns. */
  selectInputs?: FormSelectInputs<T>;
  /** Checkbox input fields for boolean values. */
  checkboxInputs?: FormInput<T, z.ZodBoolean>;
  /** Multiselect input boxes for (non-relation) array fields. */
  arrayInputs?: ArrayInputs<T>;
  /** Multiselect input boxes for related resources. */
  relationInputs?: RelationDefinitions<T>;
}

export type FormInputName = keyof AbstractResourceFormInputs<Resource>;
