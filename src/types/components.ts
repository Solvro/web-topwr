import type { ReactNode } from "react";

import type { Resource } from "@/config/enums";

import type { Id, ResourceDataType, ResourceRelation } from "./app";
import type { ResourceSchemaKey } from "./forms";
import type { DeclinableNoun } from "./polish";

export type SortDirection = "asc" | "desc";

export interface SortFiltersOptions {
  sortBy: DeclinableNoun | "";
  sortDirection: SortDirection;
  searchField: DeclinableNoun | "";
  searchTerm: string;
}

/** The accepted search parameters for the abstract resource list. */
export interface ListSearchParameters {
  page?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  searchField?: string;
  searchTerm?: string;
}

export interface ResourceFormProps<T extends Resource> {
  resource: T;
  isEmbedded?: boolean;
  className?: string;
}

export type ResourcePageProps = Readonly<{
  searchParams: Promise<{ page?: string }>;
}>;

export type ResourceEditPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export type ResourceCreatePageProps = Readonly<{
  searchParams?: Promise<Record<string, string | undefined>>;
}>;

export type LayoutProps = Readonly<{
  children: ReactNode;
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
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export type ResourceRelations<T extends Resource> = {
  [L in ResourceRelation<T>]: ResourceDataType<L>[];
};
