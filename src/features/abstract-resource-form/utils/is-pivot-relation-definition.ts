import { RelationType } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  PivotDataDefinition,
  PivotRelationDefinition,
  RelationDefinition,
  ResourceRelation,
} from "@/features/resources/types";

export const isPivotRelationDefinition = <
  T extends Resource,
  L extends ResourceRelation<T>,
>(
  definition: RelationDefinition<T, L>,
): definition is PivotRelationDefinition & {
  pivotData: PivotDataDefinition;
} =>
  definition.type === RelationType.ManyToMany && definition.pivotData != null;
