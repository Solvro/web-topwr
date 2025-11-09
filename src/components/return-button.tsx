import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import type { RoutableResource } from "@/types/app";

export function ReturnButton({
  returnLabel = "Powrót do",
  target,
  href,
  resource,
  className,
  icon: Icon = ArrowLeft,
}: { className?: string; returnLabel?: string; icon?: LucideIcon } & (
  | { target: string; href: Route; resource?: never }
  | { target?: never; href?: never; resource: RoutableResource }
)) {
  const [returnHref, returnTarget] =
    resource == null
      ? [href, target]
      : ([
          `/${resource}`,
          declineNoun(resource, {
            case: DeclensionCase.Genitive,
            plural: true,
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
