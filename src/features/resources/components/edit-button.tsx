import { SquarePen } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { EditableResource, Id } from "@/features/resources/types";
import { sanitizeId } from "@/lib/helpers/transformations";

export function EditButton({
  resource,
  id,
}: {
  resource: EditableResource;
  id: Id;
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
