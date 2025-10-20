import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";

export function CreateButton({ resource }: { resource: RoutableResource }) {
  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });
  return (
    <Button asChild>
      <Link href={`/${resource}/create`}>
        Dodaj {resourceAccusative}
        <Plus />
      </Link>
    </Button>
  );
}
