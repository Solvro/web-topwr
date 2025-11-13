import { SquarePen } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { sanitizeId } from "@/utils";

import type { EditableResource, ResourcePk } from "../types/internal";

export function EditButton({
  resource,
  id,
}: {
  resource: EditableResource;
  id: ResourcePk;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
  });
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      aria-label={`Edytuj ${resourceAccusative}`}
      tooltip="Edytuj"
    >
      <Link href={`/${resource}/edit/${sanitizeId(id)}`}>
        <SquarePen />
      </Link>
    </Button>
  );
}
