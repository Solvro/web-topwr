import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { Id, RoutableResource } from "@/types/app";

export function EditButton({
  resource,
  id,
}: {
  resource: RoutableResource;
  id: Id;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });
  return (
    <Button
      variant="ghost"
      className="h-10 w-10"
      asChild
      aria-label={`Edytuj ${resourceAccusative}`}
    >
      <Link href={`/${resource}/edit/${sanitizeId(id)}`}>
        <SquarePen />
      </Link>
    </Button>
  );
}
