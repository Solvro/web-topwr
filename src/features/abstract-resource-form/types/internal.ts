/**
 * This module contains types only used **internally** within the ARF feature,
 * not to be re-exported or imported outside of its root directory.
 */
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { Resource } from "@/features/resources";
import type {
  Id,
  ResourceDataType,
  ResourceRelation,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import type { ValueOf } from "@/types/helpers";

import type { renderAbstractResourceForm } from "../actions/render-abstract-resource-form";

export type RelationDataTuple<T extends Resource> = [
  keyof ResourceRelations<T>,
  ValueOf<ResourceRelations<T>>,
];

export interface ArfRelationContextType<T extends Resource> {
  parentResource: T;
  parentResourceId: Id;
  childResource: ResourceRelation<T>;
  closeSheet: () => void;
}

export interface ArfSheetDataContent<T extends Resource> {
  childResource: ResourceRelation<T>;
  parentResourceData: ResourceDataType<T>;
  form: ReactNode;
  item: {
    id: Id;
    name: string | undefined;
  } | null;
}

export type ArfSheetData<T extends Resource> =
  | {
      visible: true;
      content: ArfSheetDataContent<T>;
    }
  | {
      visible: false;
      content?: ArfSheetDataContent<T>;
    };

export interface ArfSheetContextType<T extends Resource> {
  resource: T;
  sheet: ArfSheetData<T>;
  setSheet: Dispatch<SetStateAction<ArfSheetData<T>>>;
  showSheet: (
    options: Omit<ArfSheetDataContent<T>, "form">,
    ...formProps: Parameters<typeof renderAbstractResourceForm>
  ) => void;
}
