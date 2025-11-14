import type {
  PivotDataDefinition,
  RelationPivotDataDefinition,
} from "@/features/resources/types";

export const isRelationPivotDefinition = (
  definition: PivotDataDefinition,
): definition is RelationPivotDataDefinition => "relatedResource" in definition;
