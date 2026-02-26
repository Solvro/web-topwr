import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ItemBadge } from "../types/badges";
import { getBadgeStyles } from "../utils/get-badge-styles";

export function ResourceBadge({ badge }: { badge: ItemBadge }) {
  const { className, style } = getBadgeStyles(badge);

  const badgeClasses = cn("py-0.5", className);

  if (badge.editRoute == null) {
    return (
      <Badge className={badgeClasses} style={style}>
        {badge.displayField}
      </Badge>
    );
  }

  return (
    <Badge className={badgeClasses} style={style} asChild>
      <Link
        href={badge.editRoute}
        className="transition-opacity hover:opacity-75"
      >
        {badge.displayField}
      </Link>
    </Badge>
  );
}
