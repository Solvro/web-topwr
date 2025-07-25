import type { FieldPath, FieldValues } from "react-hook-form";
import type { z } from "zod";

import type {
  GuideArticleSchema,
  LoginSchema,
  StudentOrganizationSchema,
} from "@/schemas";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type GuideArticleFormValues = z.infer<typeof GuideArticleSchema>;
export type StudentOrganizationFormValues = z.infer<
  typeof StudentOrganizationSchema
>;

export interface SelectInputOption {
  value: string | number;
  label: string;
}

export interface FormImageInput {
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
  isOptional?: boolean;
}

export interface FormCheckboxInput<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
}

export interface AbstractResourceFormInputs<T extends FieldValues> {
  imageInputs?: FormImageInput[];
  textInputs?: FormTextInput<T>[];
  richTextInput?: FormRichTextInput<T>;
  selectInputs?: FormSelectInput<T>[];
  checkboxInputs?: FormCheckboxInput<T>[];
}
