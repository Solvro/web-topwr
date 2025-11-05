import type { ReactNode } from "react";
import type { z } from "zod";

import type { FilterType, Resource } from "@/config/enums";
import type { ROUTE_PERMISSIONS } from "@/config/route-permissions";

import type {
  Id,
  ResourceDataType,
  ResourceRelation,
  RoutableResource,
} from "./app";
import type {
  FormInputBase,
  ResourceSchemaKey,
  SelectInputOptions,
} from "./forms";

/** The definitions of all filterable fields for a given resource. */
export type FilterDefinitions<T extends Resource = Resource> = Record<
  [T] extends [Resource] ? string : ResourceSchemaKey<T>,
  FormInputBase &
    (
      | (SelectInputOptions & {
          type: FilterType.Select;
        })
      | {
          type: FilterType.Text | FilterType.Checkbox;
        }
    )
>;

export type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export interface ResourceFormProps<T extends Resource> {
  resource: T;
  className?: string;
}

export type SearchParameters = Record<string, string | undefined>;

export type ResourcePageProps = Readonly<{
  searchParams: Promise<SearchParameters>;
}>;

export type ResourceLabelOptions = Readonly<{
  firstWordOnly?: boolean;
  plural?: boolean;
}>;

export type ResourceLayoutProps = Readonly<
  LayoutProps & {
    resource: RoutableResource;
    labelOptions?: ResourceLabelOptions;
  }
>;

export type ResourceEditPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export type ResourceCreatePageProps = Readonly<{
  searchParams?: Promise<SearchParameters>;
}>;

export interface ResourceFormSheetDataContent<T extends Resource> {
  childResource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
  form: ReactNode;
  item: {
    id: Id;
    name: string | undefined;
  } | null;
}

export type ResourceFormSheetData<T extends Resource> =
  | {
      visible: true;
      content: ResourceFormSheetDataContent<T>;
    }
  | {
      visible: false;
      content?: ResourceFormSheetDataContent<T>;
    };

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T, z.ZodString>, ReactNode>
>;
export type ResourceRelations<T extends Resource> = {
  [L in ResourceRelation<T>]: ResourceDataType<L>[];
};

export type RoutePermission = keyof typeof ROUTE_PERMISSIONS;
