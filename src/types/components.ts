import type { ReactNode } from "react";

import type { FilterType, Resource } from "@/config/enums";

import type { Id, ResourceDataType, ResourceRelation } from "./app";
import type {
  FormInputBase,
  ResourceSchemaKey,
  SelectInputOptions,
} from "./forms";

/** The definitions of all filterable fields for a given resource. */
export type FilterDefinitions = Record<
  string,
  FormInputBase &
    (
      | (SelectInputOptions & {
          type: FilterType.Select;
        })
      | {
          type: FilterType.Text;
        }
    )
>;

export interface ResourceFormProps<T extends Resource> {
  resource: T;
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
