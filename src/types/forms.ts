import type { Path } from "react-hook-form";
import type { z } from "zod";

import type { Resource } from "@/config/enums";
import type { LoginSchema, SortFiltersSchema } from "@/schemas";

import type { ResourceFormValues, ResourceSchema } from "./app";

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

/** Extracts all paths to the form values of T, such that the type of the value at that path extends Y.
 *
 * @example type BooleanPaths = ResourceSchemaKey<Resource.StudentOrganizations, z.ZodBoolean> // yields 'isStrategic' | 'coverPreview' as those are the only boolean fields defined in the schema
 */
export type ResourceSchemaKey<
  T extends Resource,
  Y extends z.ZodTypeAny = z.ZodString,
> = {
  [K in Path<ResourceFormValues<T>>]: K extends KeysOfType<
    ResourceSchema<T>["shape"],
    Y
  >
    ? K
    : never;
}[Path<ResourceFormValues<T>>];

interface FormInputBase<
  T extends Resource,
  Y extends z.ZodTypeAny = z.ZodString,
> {
  name: ResourceSchemaKey<T, Y>;
  label: string;
}

interface FormImageInput<T extends Resource> extends FormInputBase<T> {}

interface FormTextInput<T extends Resource> extends FormInputBase<T> {}

interface FormDateInput<T extends Resource> extends FormInputBase<T> {}

interface FormRichTextInput<T extends Resource> extends FormInputBase<T> {}

interface FormSelectInput<
  T extends Resource,
  Y extends string | number = string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends FormInputBase<T, z.ZodNativeEnum<any> | z.ZodEnum<any>> {
  placeholder: string;
  optionEnum: Record<string, Y>;
  optionLabels: Record<Y, string>;
}

interface FormColorInput<T extends Resource> extends FormInputBase<T> {}

interface FormDatePickerInput<T extends Resource> extends FormInputBase<T> {}

interface FormCheckboxInput<T extends Resource>
  extends FormInputBase<T, z.ZodBoolean> {}

export interface AbstractResourceFormInputs<T extends Resource> {
  imageInputs?: FormImageInput<T>[];
  textInputs?: FormTextInput<T>[];
  dateInputs?: FormDateInput<T>[];
  richTextInputs?: FormRichTextInput<T>[];
  colorInputs?: FormColorInput<T>[];
  selectInputs?: FormSelectInput<T>[];
  checkboxInputs?: FormCheckboxInput<T>[];
  datePickerInputs?: FormDatePickerInput<T>[];
}
