import type { z } from "zod";

import type { ResourceSchemaKey } from "@/types/forms";

import type { Resource } from "../enums";
import { getResourceMetadata } from "./get-resource-metadata";

/** Gets the field value of the resource's primary key (usually literal `"id"`). */
export const getResourcePk = <T extends Resource>(
  resource: T,
): ResourceSchemaKey<T, z.ZodString | z.ZodNumber> => {
  const metadata = getResourceMetadata(resource);
  return (
    metadata.pk ?? ("id" as ResourceSchemaKey<T, z.ZodString | z.ZodNumber>)
  );
};
