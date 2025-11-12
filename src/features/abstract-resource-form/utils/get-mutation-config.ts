import { FilePlus2, Save } from "lucide-react";
import { get } from "react-hook-form";

import {
  RelationType,
  getResourceMetadata,
  getResourcePk,
  getResourceQueryName,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
  XToManyResource,
} from "@/features/resources/types";
import { camelToSnakeCase, sanitizeId } from "@/lib/helpers";

import type { ArfRelationContextType } from "../types/internal";
import { isExistingItem } from "./is-existing-item";

const BASE_EDIT_CONFIG = {
  method: "PATCH",
  submitLabel: "Zapisz",
  submitIcon: Save,
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
    submitIcon: FilePlus2,
  }) as const;

export const getMutationConfig = <T extends Resource>(
  resource: T,
  defaultValues: ResourceDefaultValues<T>,
  relationContext: ArfRelationContextType<T> | null,
) => {
  const isEditing = isExistingItem(resource, defaultValues);
  const metadata = getResourceMetadata(resource);
  const submitConfigurations = metadata.form.submitConfiguration;
  const parentConfig = isEditing
    ? {
        ...(metadata.isSingleton === true
          ? getSingletonEditConfig(resource)
          : getMultiInstanceEditConfig(resource, defaultValues)),
        ...submitConfigurations?.edit,
      }
    : { ...getCreateConfig(resource), ...submitConfigurations?.create };
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
