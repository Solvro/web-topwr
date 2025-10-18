import type { Path } from "react-hook-form";
import type { z } from "zod";

import type { RelatedResource, Resource } from "@/config/enums";
import type { LoginSchema, SortFiltersSchema } from "@/schemas";

import type { AppZodObject, GenericResource, ResourceSchema } from "./app";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;

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
  T extends GenericResource,
  Y extends z.ZodTypeAny = z.ZodString,
> = TypedSchemaKey<ResourceSchema<T>, Y>;

interface FormInputBase {
  label: string;
}

type FormInput<
  T extends Resource,
  S extends z.ZodTypeAny = z.ZodString,
  P extends FormInputBase = FormInputBase,
> = Partial<Record<ResourceSchemaKey<T, S>, P>>;

type FormSelectInput<
  T extends Resource,
  Y extends string | number = string | number,
> = FormInput<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  z.ZodNativeEnum<any> | z.ZodEnum<any>,
  FormInputBase & {
    placeholder: string;
    optionEnum: Record<string, Y>;
    optionLabels: Record<Y, string>;
  }
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
  relationInputs?: Partial<Record<RelatedResource, true>>;
}
