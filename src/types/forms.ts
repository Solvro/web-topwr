import type { ArrayPath, Path } from "react-hook-form";
import type { z } from "zod";

import type { ImageType, Resource } from "@/config/enums";
import type {
  FilteredFieldSchema,
  LoginSchema,
  SortFiltersSchema,
} from "@/schemas";

import type {
  AppZodObject,
  RelationDefinitions,
  ResourceFormValues,
  ResourceSchema,
} from "./app";
import type { DeclinableNoun } from "./polish";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type FilteredField = z.infer<typeof FilteredFieldSchema>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;
export type SortFiltersFormValuesNarrowed = SortFiltersFormValues & {
  sortBy: DeclinableNoun | null | undefined;
};

/**
 * Extracts the base Zod type by unwrapping Nullable, Default, and Optional wrappers.
 * @example type Base = BaseZodType<z.ZodNullable<z.ZodString>> // yields ZodString
 */
type BaseZodType<T extends z.ZodTypeAny> = T extends
  | z.ZodNullable<infer U>
  | z.ZodDefault<infer U>
  | z.ZodOptional<infer U>
  ? BaseZodType<U>
  : T;

/**
 * Resolves the Zod type located at path P in schema S, included recursively nested paths.
 * @example type NotificationTitle = ResolvePath<ResourceSchema<Resource.Notifications>, "notification.title"> // yields ZodString
 */
type ResolvePath<
  S extends AppZodObject,
  P extends Path<z.infer<S>>,
> = P extends `${infer K}.${infer V}`
  ? K extends keyof S["shape"]
    ? S["shape"][K] extends AppZodObject
      ? V extends Path<z.infer<S["shape"][K]>>
        ? ResolvePath<S["shape"][K], V>
        : never
      : never
    : never
  : P extends keyof S["shape"]
    ? S["shape"][P]
    : never;

/**
 * Extracts all path values of schema S, such that the schema type of the value at that path extends Y.
 * @param S - Zod schema object to extract paths from
 * @param Y - Zod type to filter paths by (defaults to ZodString)
 * @example type StringPaths = TypedSchemaKey<ResourceSchema<Resource.Notifications>> // yields 'notification.title' | 'notification.body' | `topics.${number}`
 * @example type BooleanPaths = TypedSchemaKey<ResourceSchema<Resource.StudentOrganizations>, z.ZodBoolean> // yields 'coverPreview' | 'isStrategic'
 */
type TypedSchemaKey<
  S extends AppZodObject,
  Y extends z.ZodTypeAny = z.ZodString,
> = {
  [P in Path<z.infer<S>>]: BaseZodType<ResolvePath<S, P>> extends Y ? P : never;
}[Path<z.infer<S>>];

/**
 * Extracts all paths to the form values of T, such that the type of the value at that path extends Y.
 * @param T - Resource to extract schema paths from
 * @param Y - Zod type to filter paths by (defaults to ZodTypeAny)
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
