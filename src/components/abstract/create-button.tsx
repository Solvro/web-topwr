import { Plus } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import type { CreatableResource, ResourceFormValues } from "@/types/app";

export function CreateButton<T extends CreatableResource>({
  className,
  resource,
  prefillAttributes = {},
  ...props
}: {
  className?: string;
  resource: T;
  prefillAttributes?: Partial<Record<keyof ResourceFormValues<T>, string>>;
} & Omit<ComponentProps<typeof Button>, "asChild">) {
  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });
  const searchParameters = new URLSearchParams(
    prefillAttributes as Record<string, string>,
  ).toString();

  const content = (
    <>
      Dodaj {resourceAccusative}
      <Plus />
    </>
  );
  const isLink = props.onClick == null;
  return (
    <Button asChild={isLink} className={className} {...props}>
      {isLink ? (
        <Link href={`/${resource}/create?${searchParameters}`}>{content}</Link>
      ) : (
        content
      )}
    </Button>
  );
}
