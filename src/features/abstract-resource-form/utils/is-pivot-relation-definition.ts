import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import type {
  PivotDataDefinition,
  PivotRelationDefinition,
  RelationDefinition,
  ResourceRelation,
} from "@/types/app";

export const isPivotRelationDefinition = <
  T extends Resource,
  L extends ResourceRelation<T>,
>(
  definition: RelationDefinition<T, L>,
): definition is PivotRelationDefinition & {
  pivotData: PivotDataDefinition;
} =>
  definition.type === RelationType.ManyToMany && definition.pivotData != null;
