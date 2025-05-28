"use client";

import { ChevronsLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let title = "Page";

  const titleMap: Record<string, string> = {
    "/guide_articles/create": "Dodawanie artykułu",
    "/guide_articles/edit": "Edycja artykułu",
    "/guide_articles": "Zarządzenie artykułami",
  };

  const matched = Object.entries(titleMap).find(([key]) => {
    const isMatch = pathname.startsWith(key);
    return isMatch;
  });

  if (matched != null) {
    title = matched[1];
  }

  return (
    <div className="flex h-full flex-col space-y-5 py-5">
      <h2 className="bg-primary w-96 rounded-r-xl p-5 text-center text-lg font-medium whitespace-nowrap text-white md:w-[30rem] xl:w-[40rem]">
        {title}
      </h2>
      <div className="container mx-auto flex h-full flex-grow flex-col space-y-1 px-2 xl:px-32">
        <div className="flex-grow">{children}</div>
        <Button
          variant={"ghost"}
          className="text-primary hover:text-primary w-min"
          asChild
        >
          <Link href="/">
            <ChevronsLeft />
            Wroć na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
