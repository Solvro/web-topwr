import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import type { ResourceFormValues, RoutableResource } from "@/types/app";

export function CreateButton<T extends RoutableResource>({
  className,
  resource,
  prefillAttributes = {},
  asSheet = false,
  onClick,
}: {
  className?: string;
  resource: T;
  prefillAttributes?: Partial<Record<keyof ResourceFormValues<T>, string>>;
  asSheet?: boolean;
  onClick?: () => void;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });
  const searchParameters = new URLSearchParams(
    prefillAttributes as Record<string, string>,
  ).toString();
  return asSheet ? (
    <Button variant="default" className={className} onClick={onClick}>
      Dodaj {resourceAccusative}
      <Plus />
    </Button>
  ) : (
    <Button asChild className={className}>
      <Link href={`/${resource}/create?${searchParameters}`}>
        Dodaj {resourceAccusative}
        <Plus />
      </Link>
    </Button>
  );
}
