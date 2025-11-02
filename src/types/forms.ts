import type { Path } from "react-hook-form";
import type { z } from "zod";

import type { Resource } from "@/config/enums";
import type {
  FilteredFieldSchema,
  LoginSchema,
  SortFiltersSchema,
} from "@/schemas";

import type { AppZodObject, RelationDefinitions, ResourceSchema } from "./app";
import type { DeclinableNoun } from "./polish";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type FilteredField = z.infer<typeof FilteredFieldSchema>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;
export type SortFiltersFormValuesNarrowed = SortFiltersFormValues & {
  sortBy: DeclinableNoun | null | undefined;
};

/** Picks from the T only those fields which are assignable to U. */
type KeysOfType<T extends z.ZodRawShape, U extends z.ZodTypeAny> = {
  [K in keyof T]: BaseZodType<T[K]> extends U ? K : never;
}[keyof T];

type BaseZodType<T extends z.ZodTypeAny> = T extends
  | z.ZodNullable<infer U>
  | z.ZodDefault<infer U>
  | z.ZodOptional<infer U>
  ? BaseZodType<U>
  : T;

/** Extracts all path values of schema S, such that the schema type of the value at that path extends Y. */
type TypedSchemaKey<
  S extends AppZodObject,
  Y extends z.ZodTypeAny = z.ZodString,
> = {
  [K in Path<z.infer<S>>]: K extends KeysOfType<S["shape"], Y> ? K : never;
}[Path<z.infer<S>>];

/** Extracts all paths to the form values of T, such that the type of the value at that path extends Y.
 *
 * @example type BooleanPaths = ResourceSchemaKey<Resource.StudentOrganizations, z.ZodBoolean> // yields 'isStrategic' | 'coverPreview' as those are the only boolean fields defined in the schema
 */
export type ResourceSchemaKey<
  T extends Resource,
  Y extends z.ZodTypeAny = z.ZodTypeAny,
> = TypedSchemaKey<ResourceSchema<T>, Y>;

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

export type FormSelectInput<T extends Resource> = FormInput<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  z.ZodNativeEnum<any> | z.ZodEnum<any>,
  SelectInputOptions
>;

export interface AbstractResourceFormInputs<T extends Resource> {
  /** Image upload inputs for image key fields. */
  imageInputs?: FormInput<T>;
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
  selectInputs?: FormSelectInput<T>;
  /** Checkbox input fields for boolean values. */
  checkboxInputs?: FormInput<T, z.ZodBoolean>;
  /** Multiselect input boxes for related resources. */
  relationInputs?: RelationDefinitions<T>;
}

export type FormInputName = keyof AbstractResourceFormInputs<Resource>;
