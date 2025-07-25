import type { Path } from "react-hook-form";
import type { z } from "zod";

import { ApiImage } from "../api-image";
import { ImageInputClient } from "./client";

export type ImageInputPropsGeneric = z.infer<z.ZodObject<z.ZodRawShape>>;
export interface ImageInputProps<T extends ImageInputPropsGeneric> {
  label: string;
  name: Path<T>;
  onChange: (value: string) => void;
}

export function ImageInput<T extends ImageInputPropsGeneric>({
  value,
  ...props
}: ImageInputProps<T> & {
  value: string | null;
}) {
  return (
    <ImageInputClient
      {...props}
      existingImage={
        value == null || value === "" ? null : (
          <ApiImage imageKey={value} alt={props.label} />
        )
      }
    />
  );
}
