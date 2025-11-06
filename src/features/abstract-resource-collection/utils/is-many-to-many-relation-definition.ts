import { RelationType } from "@/features/resources";

export const isManyToManyRelationDefinition = (
  definition: unknown,
): definition is { type: RelationType.ManyToMany } => {
  return (
    typeof definition === "object" &&
    definition !== null &&
    "type" in definition &&
    definition.type === RelationType.ManyToMany
  );
};
