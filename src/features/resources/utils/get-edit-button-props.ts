import type { ComponentProps } from "react";

import type { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";

import type { Resource } from "../enums";

export const getEditButtonProps = (
  resource: Resource,
): Partial<ComponentProps<typeof Button>> => {
  const resourceAccusative = declineNoun(resource, {
    case: GrammaticalCase.Accusative,
  });
  return {
    variant: "ghost",
    size: "icon",
    "aria-label": `Edytuj ${resourceAccusative}`,
    tooltip: "Edytuj",
  };
};
