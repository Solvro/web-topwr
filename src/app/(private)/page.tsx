"use client";

import type { VariantProps } from "class-variance-authority";
import {
  BookOpen,
  Building,
  Calendar,
  Megaphone,
  Notebook,
  RefreshCcw,
  ScrollText,
  University,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase, Resource } from "@/config/enums";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, toTitleCase } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";

export default function Home() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto flex h-full flex-col items-center space-y-8 p-4 sm:p-8 2xl:max-w-[1280px]">
      <span className="mt-4 w-full text-2xl">
        Cześć, {getUserDisplayName(auth.user)}!
      </span>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full grid grid-cols-subgrid gap-4">
          <DashboardButton
            href="/"
            icon={RefreshCcw}
            label="Review zmian"
            variant="outline"
          />
        </div>
        <div className="col-span-full grid grid-cols-subgrid gap-4">
          <DashboardButton
            resource={Resource.StudentOrganizations}
            icon={Building}
          />
          <DashboardButton resource={Resource.GuideArticles} icon={BookOpen} />
          <DashboardButton resource={Resource.Banners} icon={Megaphone} />
          <DashboardButton resource={Resource.CalendarEvents} icon={Calendar} />
          <DashboardButton resource={Resource.Departments} icon={University} />
          <DashboardButton resource={Resource.Contributors} icon={UsersRound} />
          <DashboardButton resource={Resource.Versions} icon={Notebook} />
          <DashboardButton resource={Resource.Milestones} icon={ScrollText} />
        </div>
      </div>
    </div>
  );
}

function DashboardButton({
  icon: Icon,
  variant = "default",
  className = "",
  href: hrefOverride,
  label: labelOverride,
  resource,
}: VariantProps<typeof Button> & {
  icon: LucideIcon;
  className?: string;
} & (
    | { href?: never; label?: never; resource: RoutableResource }
    | { href: Route; label: string; resource?: never }
  )) {
  const [href, label] =
    resource == null
      ? [hrefOverride, labelOverride]
      : ([
          `/${resource}`,
          declineNoun(resource, {
            case: DeclensionCase.Nominative,
            plural: true,
          }),
        ] as const);
  return (
    <Button
      className={`h-20 w-full justify-start space-x-2 rounded-xl ${className}`}
      variant={variant}
      asChild
    >
      <Link href={href}>
        <Icon style={{ width: 20, height: 20 }} className="ml-2" />
        <span className="text-lg md:text-xl">{toTitleCase(label)}</span>
      </Link>
    </Button>
  );
}
