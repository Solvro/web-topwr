import type { ReactNode } from "react";
import type { z } from "zod";

import type { RoutePermission } from "@/features/authentication/types";
import type { Resource } from "@/features/resources";
import type {
  RelatedResource,
  ResourceDataType,
  ResourceDataWithRelations,
  RoutableResource,
} from "@/features/resources/types";

import type { ResourceSchemaKey } from "./forms";

export type WrapperProps = Readonly<{
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

export type RouteOrResource =
  | { route: RoutePermission; resource?: never }
  | { route?: never; resource: RoutableResource };

export type ResourceLayoutProps = Readonly<
  WrapperProps & {
    labelOptions?: ResourceLabelOptions;
    header?: ReactNode;
  } & RouteOrResource
>;

export type ResourceEditPageProps = Readonly<{
  params: Promise<{ id?: string }>;
}>;

export type ResourceCreatePageProps = Readonly<{
  searchParams?: Promise<SearchParameters>;
}>;

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T, z.ZodString>, ReactNode>
>;
export type ResourceRelations<T extends Resource> = {
  [L in RelatedResource<T>]:
    | ResourceDataType<L>[]
    | ResourceDataWithRelations<L>[];
};
