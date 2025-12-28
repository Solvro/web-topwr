import type { z } from "zod";

import type { Resource } from "../enums";
import type { AnyZodEnum, ResourceSchemaKey } from "../types/internal";
import { getResourceMetadata } from "./get-resource-metadata";

/** Gets the field value of the resource's primary key (usually literal `"id"`). */
export const getResourcePk = <T extends Resource>(
  resource: T,
): ResourceSchemaKey<T, z.ZodString | z.ZodNumber | AnyZodEnum> => {
  const metadata = getResourceMetadata(resource);
  return (
    metadata.pk ??
    ("id" as ResourceSchemaKey<T, z.ZodString | z.ZodNumber | AnyZodEnum>)
  );
};
