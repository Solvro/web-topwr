import { Plus } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { CreatableResource, ResourceFormValues } from "@/types/app";

export function CreateButton<T extends CreatableResource>({
  className,
  resource,
  prefillAttributes = {},
}: {
  className?: string;
  resource: T;
  prefillAttributes?: Partial<Record<keyof ResourceFormValues<T>, string>>;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
  });
  const searchParameters = new URLSearchParams(
    prefillAttributes as Record<string, string>,
  ).toString();
  return (
    <Button asChild className={className}>
      <Link href={`/${resource}/create?${searchParameters}`}>
        Dodaj {resourceAccusative}
        <Plus />
      </Link>
    </Button>
  );
}
