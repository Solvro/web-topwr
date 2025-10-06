"use client";

import type { VariantProps } from "class-variance-authority";
import {
  BookOpen,
  Building,
  Calendar,
  Megaphone,
  RefreshCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase, Resource } from "@/config/enums";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";

export default function Home() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto flex h-full flex-col items-center space-y-14 p-4 sm:p-8 md:space-y-20 2xl:max-w-[1280px]">
      <span className="mt-4 w-full text-2xl md:mt-16">
        Cześć, {getUserDisplayName(auth.user)}!
      </span>
      <div className="w-full columns-1 space-y-4 md:columns-2">
        <DashboardButton
          resource={Resource.StudentOrganizations}
          icon={Building}
        />
        <DashboardButton resource={Resource.GuideArticles} icon={BookOpen} />
        <DashboardButton
          href="/"
          icon={RefreshCcw}
          label="Review zmian"
          variant="outline"
        />
        <DashboardButton
          resource={Resource.Banners}
          icon={Megaphone}
          variant="outline"
        />
        <DashboardButton resource={Resource.CalendarEvents} icon={Calendar} />
      </div>
    </div>
  );
}

/**
 * Declines the resource name correctly and uses its first word only.
 * Used to ensure the label isn't too long for the dashboard buttons.
 *
 * @example getLabelFromResource(Resource.StudentOrganizations) === 'Zarządzanie organizacjami'
 */
function getLabelFromResource(resource: Resource) {
  const declined = declineNoun(resource, {
    case: DeclensionCase.Instrumental,
    plural: true,
  });
  const firstWord = declined.split(" ")[0];
  return `Zarządzanie ${firstWord}`;
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
    | { href?: never; label?: never; resource: Resource }
    | { href: string; label: string; resource?: never }
  )) {
  const [href, label] =
    resource == null
      ? [hrefOverride, labelOverride]
      : [`/${resource}`, getLabelFromResource(resource)];
  return (
    <Button
      className={`h-20 w-full justify-start space-x-2 rounded-xl ${className}`}
      variant={variant}
      asChild
    >
      <Link href={href}>
        <Icon style={{ width: 20, height: 20 }} className="ml-2" />
        <span className="text-lg md:text-xl">{label}</span>
      </Link>
    </Button>
  );
}
