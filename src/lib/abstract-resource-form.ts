import { FilePlus2, Save } from "lucide-react";
import { get } from "react-hook-form";

import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import type { ArfRelationContextType } from "@/hooks/use-arf-relation";
import {
  camelToSnakeCase,
  getResourcePk,
  getResourceQueryName,
  getResourceRelationDefinitions,
  sanitizeId,
} from "@/lib/helpers";
import type {
  PivotDataDefinition,
  RelationPivotDataDefinition,
  ResourceDataType,
  ResourceDataWithRelations,
  ResourceDefaultValues,
  XToManyResource,
} from "@/types/app";

export const isExistingResourceItem = <T extends Resource>(
  resource: T,
  item: ResourceDefaultValues<T>,
): item is ResourceDataWithRelations<T> => {
  const value = get(item, getResourcePk(resource)) as unknown;
  return value != null && value !== "";
};

const getEditConfig = <T extends Resource>(
  resource: T,
  defaultValues: ResourceDataType<T>,
) => {
  const unsanitizedPkValue = (get(defaultValues, getResourcePk(resource)) ??
    defaultValues.id) as string | undefined;
  if (unsanitizedPkValue == null || unsanitizedPkValue === "") {
    throw new Error(
      `Cannot obtain primary key value while editing resource: ${JSON.stringify(defaultValues)}`,
    );
  }
  const pkValue = sanitizeId(unsanitizedPkValue);
  return {
    mutationKey: `update__${resource}__${pkValue}`,
    endpoint: pkValue,
    method: "PATCH",
    submitLabel: "Zapisz",
    SubmitIconComponent: Save,
  } as const;
};

const getCreateConfig = <T extends Resource>(resource: T) =>
  ({
    mutationKey: `create__${resource}`,
    endpoint: "/",
    method: "POST",
    submitLabel: "Utwórz",
    SubmitIconComponent: FilePlus2,
  }) as const;

export const getMutationConfig = <T extends Resource>(
  resource: T,
  defaultValues: ResourceDefaultValues<T>,
  relationContext: ArfRelationContextType<T> | null,
) => {
  const isEditing = isExistingResourceItem(resource, defaultValues);
  const parentConfig = isEditing
    ? getEditConfig(resource, defaultValues)
    : getCreateConfig(resource);
  if (relationContext == null || isEditing) {
    // always fetch the resource directly if editing a related resource
    // e.g. PATCH /api/v1/student_organization_links
    return parentConfig;
  }
  const relationDefinition = getResourceRelationDefinitions(
    relationContext.parentResource,
  )[relationContext.childResource];
  if (relationDefinition.type !== RelationType.OneToMany) {
    // only 1:n relations need special handling when creating a related resource
    return parentConfig;
  }
  // fetch the parent resource when creating a related resource
  // e.g. POST /api/v1/student_organizations/{parentId}/tags
  const queryName = getResourceQueryName(
    relationContext.childResource as XToManyResource,
  );
  // of course the backend uses camelCase for query params but snake_case for path segments...
  const pathSegment = camelToSnakeCase(queryName);
  const config = {
    ...parentConfig,
    endpoint: `${sanitizeId(relationContext.parentResourceId)}/${pathSegment}`,
    resource: relationContext.parentResource,
  } as const;
  return config;
};

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

export const isRelationPivotDefinition = (
  definition: PivotDataDefinition,
): definition is RelationPivotDataDefinition => "relatedResource" in definition;
