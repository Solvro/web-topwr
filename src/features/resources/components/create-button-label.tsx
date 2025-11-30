import { Plus } from "lucide-react";

import { GrammaticalCase, declineNoun } from "@/features/polish";

import type { Resource } from "../enums";

export function CreateButtonLabel({
  resource,
  plural = false,
}: {
  resource: Resource;
  plural?: boolean;
}) {
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
    plural,
  });

  return (
    <>
      Dodaj {resourceAccusative}
      <Plus />
    </>
  );
}
