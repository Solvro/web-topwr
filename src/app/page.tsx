"use client";

import type { VariantProps } from "class-variance-authority";
import { BookOpen, Building, RefreshCcw, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ResourcePaths } from "@/lib/enums";
import { getUserDisplayName } from "@/lib/helpers";

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
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <DashboardButton
          href={`/${ResourcePaths.StudentOrganizations}`}
          icon={Building}
          label="Zarządzanie organizacjami"
          className="order-1"
        />
        <DashboardButton
          href={`/${ResourcePaths.GuideArticles}`}
          icon={BookOpen}
          label="Zarządzanie artykułami"
          className="order-2 md:order-3"
        />
        <DashboardButton
          href="/"
          icon={RefreshCcw}
          label="Review zmian"
          variant="outline"
          className="order-3 md:order-2"
        />
        <DashboardButton
          href="/"
          icon={Send}
          label="Wyślij powiadomienie"
          variant="outline"
          className="order-4"
        />
      </div>
    </div>
  );
}

function DashboardButton({
  href,
  icon: Icon,
  label,
  variant = "default",
  className = "",
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: VariantProps<typeof Button>["variant"];
  className?: string;
}) {
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
