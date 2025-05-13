import { BookOpen, Building, RefreshCcw, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <div className="container mx-auto grid max-w-[1280px] grid-cols-1 gap-8 p-4 md:grid-cols-2">
        <DashboardButton
          href="/organizations"
          icon={Building}
          label="Zarządzanie organizacjami"
        />
        <DashboardButton
          href="/"
          icon={BookOpen}
          label="Zarządzanie artykułami"
        />
        <DashboardButton
          href="/"
          icon={RefreshCcw}
          label="Review zmian"
          variant="outline"
        />
        <DashboardButton
          href="/"
          icon={Send}
          label="Wyślij powiadomienie"
          variant="outline"
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
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "default" | "outline";
}) {
  return (
    <Link href={href} passHref>
      <Button className="h-20 w-full justify-start space-x-2" variant={variant}>
        <Icon style={{ width: 20, height: 20 }} />
        <span className="text-xl">{label}</span>
      </Button>
    </Link>
  );
}
