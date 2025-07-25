import type { ReactNode } from "react";
import type { DefaultValues, Path } from "react-hook-form";
import type { z } from "zod";

import { ApiImage } from "@/components/image/api/server";
import type { Resource } from "@/config/enums";
import type { AppZodObject } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

export type WithOptionalId<T> = T & { id?: number };

export interface AbstractResourceFormProps<T extends AppZodObject> {
  resource: Resource;
  defaultValues?: WithOptionalId<DefaultValues<z.infer<T>>>;
  formInputs: AbstractResourceFormInputs<z.infer<T>>;
}

export type ExistingImages<T extends AppZodObject> = Partial<
  Record<Path<z.infer<T>>, ReactNode>
>;
export function AbstractResourceForm<T extends AppZodObject>(
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
