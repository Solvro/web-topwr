import type {
  PivotDataDefinition,
  RelationPivotDataDefinition,
} from "@/types/app";

export const isRelationPivotDefinition = (
  definition: PivotDataDefinition,
): definition is RelationPivotDataDefinition => "relatedResource" in definition;
