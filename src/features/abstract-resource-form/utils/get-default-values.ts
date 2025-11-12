import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { getResourceRelationDefinitions } from "@/lib/helpers";
import type { ResourceDefaultValues } from "@/types/app";

import type { ArfRelationContextType } from "../types/internal";

export const getDefaultValues = <T extends Resource>(
  defaultValues: ResourceDefaultValues<T>,
  relationContext: ArfRelationContextType<T> | null,
) => {
  if (relationContext == null) {
    return defaultValues;
  }
  const {
    parentResource,
    childResource,
    parentResourceId: parentResourcePkValue,
  } = relationContext;
  const relationDefinitions = getResourceRelationDefinitions(parentResource);
  const relationDefinition = relationDefinitions[childResource];
  if (relationDefinition.type !== RelationType.OneToMany) {
    return defaultValues;
  }
  const combinedDefaultValues = {
    ...defaultValues,
    [relationDefinition.foreignKey]: parentResourcePkValue,
  };
  return combinedDefaultValues;
};
