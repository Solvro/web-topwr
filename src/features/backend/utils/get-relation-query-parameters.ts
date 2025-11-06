import type { Resource } from "@/features/resources";
import { getRecursiveRelations } from "@/features/resources/node";

export function getRelationQueryParameters(
  resource: Resource | undefined,
  includeRelations: boolean,
): string {
  if (resource == null || !includeRelations) {
    return "";
  }
  const relationSearchParameters = Object.fromEntries(
    getRecursiveRelations(resource).map((relation) => [relation, "true"]),
  );
  return new URLSearchParams(relationSearchParameters).toString();
}
