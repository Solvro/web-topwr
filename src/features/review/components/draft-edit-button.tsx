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

  if (metadata.apiDraftPath == null) {
    return null;
  }

  return (
    <Button asChild variant="ghost" size="icon" tooltip="Edytuj">
      <Link href={`/drafts/${resource}/edit/${sanitizeId(id)}` as Route}>
        <SquarePen />
      </Link>
    </Button>
  );
}
