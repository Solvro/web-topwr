import { FilePlus2, Save } from "lucide-react";
import { get } from "react-hook-form";

import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import type { ArfRelationContextType } from "@/hooks/use-arf-relation";
import {
  camelToSnakeCase,
  fetchResources,
  getResourceMetadata,
  getResourcePk,
  getResourceQueryName,
  getResourceRelationDefinitions,
  sanitizeId,
  typedFromEntries,
} from "@/lib/helpers";
import type {
  PivotDataDefinition,
  PivotRelationDefinition,
  RelationDefinition,
  RelationDefinitions,
  RelationPivotDataDefinition,
  ResourceDataType,
  ResourceDataWithRelations,
  ResourceDefaultValues,
  ResourcePivotRelation,
  ResourcePivotRelationData,
  ResourceRelation,
  XToManyResource,
} from "@/types/app";

export const isExistingResourceItem = <T extends Resource>(
  resource: T,
  item: ResourceDefaultValues<T>,
): item is ResourceDataWithRelations<T> => {
  const value = get(item, getResourcePk(resource)) as unknown;
  return value != null && value !== "";
};

const BASE_EDIT_CONFIG = {
  method: "PATCH",
  submitLabel: "Zapisz",
  SubmitIconComponent: Save,
} as const;

const getSingletonEditConfig = (resource: Resource) =>
  ({
    ...BASE_EDIT_CONFIG,
    mutationKey: `update__${resource}__singleton`,
    endpoint: "/",
  }) as const;

const getMultiInstanceEditConfig = <T extends Resource>(
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
    ...BASE_EDIT_CONFIG,
    mutationKey: `update__${resource}__${pkValue}`,
    endpoint: pkValue,
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
    ? getResourceMetadata(resource).isSingleton === true
      ? getSingletonEditConfig(resource)
      : getMultiInstanceEditConfig(resource, defaultValues)
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

export const isPivotRelationDefinition = <
  T extends Resource,
  L extends ResourceRelation<T>,
>(
  definition: RelationDefinition<T, L>,
): definition is PivotRelationDefinition & {
  pivotData: PivotDataDefinition;
} =>
  definition.type === RelationType.ManyToMany && definition.pivotData != null;

export const isRelationPivotDefinition = (
  definition: PivotDataDefinition,
): definition is RelationPivotDataDefinition => "relatedResource" in definition;

export const fetchPivotResources = async <T extends Resource>(
  relationInputs: RelationDefinitions<T> | undefined,
): Promise<ResourcePivotRelationData<T>> => {
  if (relationInputs == null) {
    return {} as ResourcePivotRelationData<T>;
  }
  const responses = await Promise.all(
    Object.values(relationInputs).map(async (relationDefinition) => {
      const definition = relationDefinition as RelationDefinition<
        T,
        ResourceRelation<T>
      >;
      if (
        !isPivotRelationDefinition(definition) ||
        !isRelationPivotDefinition(definition.pivotData)
      ) {
        return [];
      }
      const resource = definition.pivotData.relatedResource;
      const response = await fetchResources(resource, -1);
      const data = response.data as ResourceDataType<typeof resource>[];
      return [
        [resource, data] satisfies [
          typeof resource,
          ResourceDataType<typeof resource>[],
        ],
      ];
    }),
  );
  const entries = responses.flat() as [
    ResourcePivotRelation<T>,
    ResourceDataType<ResourcePivotRelation<T>>[],
  ][];
  return typedFromEntries<ResourcePivotRelationData<T>>(entries);
};
