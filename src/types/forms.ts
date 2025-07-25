import type { FieldPath, FieldValues } from "react-hook-form";
import type { z } from "zod";

import type { Resource } from "@/config/enums";
import type { LoginSchema, SortFiltersSchema } from "@/schemas";
import type { RESOURCE_SCHEMAS } from "@/schemas/resources";

type ResourceSchemas = typeof RESOURCE_SCHEMAS;

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type GuideArticleFormValues = z.infer<
  ResourceSchemas[Resource.GuideArticles]
>;
export type StudentOrganizationFormValues = z.infer<
  ResourceSchemas[Resource.StudentOrganizations]
>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;

export interface SelectInputOption {
  value: string | number;
  label: string;
}

export interface FormImageInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
}

export interface FormTextInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
}

export interface FormRichTextInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
}

export interface FormSelectInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  options: SelectInputOption[];
}

export interface FormCheckboxInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
}

export interface AbstractResourceFormInputs<T extends FieldValues> {
  imageInputs?: FormImageInput<T>[];
  textInputs?: FormTextInput<T>[];
  richTextInput?: FormRichTextInput<T>;
  selectInputs?: FormSelectInput<T>[];
  checkboxInputs?: FormCheckboxInput<T>[];
}
