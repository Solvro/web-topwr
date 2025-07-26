import type { Path, PathValue } from "react-hook-form";
import type { z } from "zod";

import type { Resource } from "@/config/enums";
import type { LoginSchema, SortFiltersSchema } from "@/schemas";

import type { ResourceFormValues } from "./app";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;

type Optional<T> = T | null | undefined;

export interface SelectInputOption {
  value: string | number;
  label: string;
}

/** Extracts all paths to the form values of T, such that the type of the value at that path extends Y.
 *
 * @example type BooleanPaths = ResourceSchemaKey<Resource.StudentOrganizations, boolean> // yields 'isStrategic' as that is the only boolean field defined in the schema
 */
export type ResourceSchemaKey<T extends Resource, Y = Optional<string>> = {
  // TODO: extract the paths using the Zod schema instead of the types, because then we can be more specific
  // Currently selects can use keys whose values are of type string | number, but ideally they should only use those keys whose schema type uses a z.nativeEnum
  [K in Path<ResourceFormValues<T>>]: PathValue<
    ResourceFormValues<T>,
    K
  > extends Y
    ? K
    : never;
}[Path<ResourceFormValues<T>>];

interface FormImageInput<T extends Resource> {
  name: ResourceSchemaKey<T>;
  label: string;
}

interface FormTextInput<T extends Resource> {
  name: ResourceSchemaKey<T>;
  label: string;
}

interface FormRichTextInput<T extends Resource> {
  name: ResourceSchemaKey<T>;
  label: string;
}

interface FormSelectInput<T extends Resource> {
  name: ResourceSchemaKey<T, Optional<SelectInputOption["value"]>>;
  label: string;
  placeholder: string;
  options: SelectInputOption[];
}

interface FormCheckboxInput<T extends Resource> {
  name: ResourceSchemaKey<T, boolean>;
  label: string;
}

export interface AbstractResourceFormInputs<T extends Resource> {
  imageInputs?: FormImageInput<T>[];
  textInputs?: FormTextInput<T>[];
  richTextInput?: FormRichTextInput<T>;
  selectInputs?: FormSelectInput<T>[];
  checkboxInputs?: FormCheckboxInput<T>[];
}
