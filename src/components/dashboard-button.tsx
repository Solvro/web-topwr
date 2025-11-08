import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import { getManagingResourceLabel, toTitleCase } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import type { RoutableResource } from "@/types/app";

export function DashboardButton({
  icon: Icon,
  variant = "default",
  className,
  href: hrefOverride,
  label: labelOverride,
  resource,
  longLabel = false,
}: VariantProps<typeof Button> & {
  icon: LucideIcon;
  className?: string;
} & (
    | {
        href?: Route;
        label?: string;
        resource: RoutableResource;
        longLabel?: boolean;
      }
    | { href: Route; label: string; resource?: never; longLabel?: never }
  )) {
  const [href, label] =
    resource == null
      ? [hrefOverride, labelOverride]
      : [
          hrefOverride ?? (`/${resource}` as const),
          longLabel
            ? getManagingResourceLabel(resource)
            : (labelOverride ??
              declineNoun(resource, {
                case: DeclensionCase.Nominative,
                plural: true,
              })),
        ];

  const useViewTransition = resource != null && variant === "default";

  return (
    <Button
      className={cn(
        "h-20 w-full justify-start space-x-2 rounded-xl",
        className,
      )}
      variant={variant}
      asChild
    >
      <Link
        href={href}
        style={{
          viewTransitionName: useViewTransition
            ? `resource-card-${resource}`
            : undefined,
        }}
      >
        <Icon className="ml-2 size-5" />
        <span
          className="text-lg md:text-xl"
          style={{
            viewTransitionName: useViewTransition
              ? `resource-title-${resource}`
              : undefined,
          }}
        >
          {toTitleCase(label)}
        </span>
      </Link>
    </Button>
  );
}
