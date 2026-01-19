import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ItemBadge } from "../types/badges";
import { getBadgeStyles } from "../utils/get-badge-styles";

export function ResourceBadge({ badge }: { badge: ItemBadge }) {
  const { className, style } = getBadgeStyles(badge);

  const badgeContent = (
    <Badge className={cn("py-0.5", className)} style={style}>
      {badge.displayField}
    </Badge>
  );

  if (badge.editRoute != null) {
    return (
      <Link
        href={badge.editRoute}
        className="transition-opacity hover:opacity-75"
      >
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
