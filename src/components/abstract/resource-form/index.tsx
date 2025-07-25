import type { ReactNode } from "react";
import type { DefaultValues, Path } from "react-hook-form";
import type { z } from "zod";

import { ApiImage } from "@/components/image/api/server";
import type { Resource } from "@/config/enums";
import type { AbstractResourceFormInputs } from "@/types/forms";
import type { WithOptionalId } from "@/types/helpers";

import { AbstractResourceFormInternal } from "./client";

export type AbstractResourceFormGeneric = z.ZodObject<z.ZodRawShape>;
export interface AbstractResourceFormProps<
  T extends AbstractResourceFormGeneric,
> {
  resource: Resource;
  defaultValues?: WithOptionalId<DefaultValues<z.infer<T>>>;
  formInputs: AbstractResourceFormInputs<z.infer<T>>;
  returnButtonPath: string;
}

export type ExistingImages<T extends AbstractResourceFormGeneric> = Partial<
  Record<Path<z.infer<T>>, ReactNode>
>;

export function AbstractResourceForm<T extends z.ZodObject<z.ZodRawShape>>(
  props: AbstractResourceFormProps<T>,
) {
  const existingImages: ExistingImages<T> = {};

  for (const input of props.formInputs.imageInputs ?? []) {
    const imageKey = props.defaultValues?.[input.name] ?? null;
    if (imageKey == null || imageKey === "") {
      continue;
    }
    existingImages[input.name] = (
      <ApiImage imageKey={imageKey} alt={input.label} />
    );
  }

  return (
    <AbstractResourceFormInternal {...props} existingImages={existingImages} />
  );
}
