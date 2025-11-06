import { RelationType } from "@/features/resources";

export const isManyToOneRelationDefinition = (
  definition: unknown,
): definition is { type: RelationType.ManyToOne } => {
  return (
    typeof definition === "object" &&
    definition !== null &&
    "type" in definition &&
    definition.type === RelationType.ManyToOne
  );
};
