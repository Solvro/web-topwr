import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { permit } from "@/features/authentication/server";
import type { RoutePermission } from "@/features/authentication/types";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import {
  getManagingResourceLabel,
  getResourceMetadata,
} from "@/features/resources";
import type {
  DisplayableResource,
  RoutableResource,
} from "@/features/resources/types";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils";

export async function DashboardButton({
  icon,
  variant = "default",
  className,
  href: hrefOverride,
  label: labelOverride,
  resource,
  longLabel = false,
  preserveCase = false,
}: VariantProps<typeof Button> & {
  className?: string;
} & (
    | {
        href?: Route;
        label?: string;
        icon?: LucideIcon;
        resource: RoutableResource & DisplayableResource;
        longLabel?: boolean;
        preserveCase?: boolean;
      }
    | {
        href: Route & RoutePermission;
        label: string;
        icon: LucideIcon;
        resource?: never;
        longLabel?: never;
        preserveCase?: never;
      }
  )) {
  const [route, label, Icon] =
    resource == null
      ? [hrefOverride, labelOverride, icon]
      : [
          `/${resource}` as const,
          longLabel
            ? getManagingResourceLabel(resource)
            : (labelOverride ??
              declineNoun(resource, {
                case: GrammaticalCase.Nominative,
                plural: true,
              })),
          icon ?? getResourceMetadata(resource).icon,
        ];
  if (Icon == null) {
    throw new Error(
      `Displayable resource ${resource ?? route} has no icon defined in metadata`,
    );
  }

  const hasPermission = await permit(route);
  if (!hasPermission) {
    return null;
  }

  const useViewTransition = resource != null && variant === "default";

  return (
    <Button
      className={cn(
        "h-16 w-full justify-start gap-4 rounded-xl sm:h-20",
        className,
      )}
      variant={variant}
      asChild
    >
      <Link
        href={hrefOverride ?? route}
        style={{
          viewTransitionName: useViewTransition
            ? `resource-card-${resource}`
            : undefined,
        }}
      >
        <Icon className="ml-2 size-5" />
        <h2
          className="sm:text-base md:text-xl"
          style={{
            viewTransitionName: useViewTransition
              ? `resource-title-${resource}`
              : undefined,
          }}
        >
          {preserveCase ? label : toTitleCase(label)}
        </h2>
      </Link>
    </Button>
  );
}
