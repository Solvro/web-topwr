import { Plus } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";

import type { CreatableResource, ResourceFormValues } from "../types/internal";

export function CreateButton<T extends CreatableResource>({
  className,
  resource,
  prefillAttributes = {},
  plural = false,
}: {
  className?: string;
  resource: T;
  prefillAttributes?: Partial<Record<keyof ResourceFormValues<T>, string>>;
  plural?: boolean;
}) {
  const searchParameters = new URLSearchParams(
    prefillAttributes as Record<string, string>,
  ).toString();
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
    plural,
  });

  return (
    <Button className={className} asChild>
      <Link href={`/${resource}/create?${searchParameters}`}>
        Dodaj {resourceAccusative}
        <Plus />
      </Link>
    </Button>
  );
}
