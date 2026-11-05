import { SquarePen } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import type { ResourcePk } from "@/features/resources/types";

import type { DraftableResource } from "../types/internal";
import { getDraftEditRoute } from "../utils/get-draft-route";

export function DraftEditButton({
  resource,
  id,
}: {
  resource: DraftableResource;
  id: ResourcePk;
}) {
  return (
    <Button asChild variant="icon" size="icon" tooltip="Edytuj draft">
      <Link href={getDraftEditRoute(resource, id)}>
        <SquarePen />
      </Link>
    </Button>
  );
}
