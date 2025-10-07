import { Plus } from "lucide-react";
import Link from "next/link";

import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { declineNoun } from "@/lib/polish";

import { Button } from "../ui/button";

export function CreateButton({ resource }: { resource: Resource }) {
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
