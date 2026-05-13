import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import { cn } from "@/lib/utils";

export function ReturnButton({
  returnLabel = "Powrót do",
  target,
  href,
  resource,
  className,
  icon: Icon = ArrowLeft,
}: {
  className?: string;
  returnLabel?: string;
  icon?: LucideIcon;
} & (
  | { target: string; href: Route; resource?: never }
  | { target?: never; href?: Route; resource: RoutableResource }
)) {
  const [returnHref, returnTarget] =
    resource == null
      ? [href, target]
      : ([
          href ?? (`/${resource}` as Route),
          declineNoun(resource, {
            case: GrammaticalCase.Genitive,
            plural: resource !== Resource.Dashboard,
          }),
        ] as const);

  return (
    <Button variant="link" asChild>
      <Link
        href={returnHref}
        className={cn("group text-foreground", className)}
      >
        <Icon
          size={16}
          className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-120"
        />
        {returnLabel} {returnTarget}
      </Link>
    </Button>
  );
}
