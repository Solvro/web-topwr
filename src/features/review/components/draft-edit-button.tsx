import { SquarePen } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { getResourceMetadata } from "@/features/resources";
import type { EditableResource, ResourcePk } from "@/features/resources/types";
import { sanitizeId } from "@/utils";

export function DraftEditButton({
  resource,
  id,
}: {
  resource: EditableResource;
  id: ResourcePk;
}) {
  const metadata = getResourceMetadata(resource);
  const draftPath = metadata.apiDraftPath?.replaceAll("_", "-"); //TODO

  if (draftPath == null) {
    return null;
  }

  return (
    <Button asChild variant="ghost" size="icon" tooltip="Edytuj">
      <Link href={`/drafts/${draftPath}/edit/${sanitizeId(id)}` as Route}>
        <SquarePen />
      </Link>
    </Button>
  );
}
