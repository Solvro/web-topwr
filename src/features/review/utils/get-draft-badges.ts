import { FilePen, FilePlusCorner } from "lucide-react";

import type { ItemBadge } from "@/features/abstract-resource-list/types";
import { declineNoun } from "@/features/polish";
import { capitalizeFirstLetter } from "@/utils";

import type { DraftData, DraftableResource } from "../types/internal";

export const getDraftBadges = <R extends DraftableResource>(
  resource: R,
  data: DraftData<R>,
): ItemBadge[] => [
  { badgeText: capitalizeFirstLetter(declineNoun(resource).nominative) },
  {
    badgeText: data.originalId == null ? "Nowy" : "Zmiany",
    icon: data.originalId == null ? FilePlusCorner : FilePen,
    color: data.originalId == null ? "var(--success)" : "var(--warning)",
  },
];
