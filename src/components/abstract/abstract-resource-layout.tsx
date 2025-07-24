import { ChevronsLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { declineNoun } from "@/lib/polish";

function getTitle(resource: Resource, pathname: string): string {
  const prefix = `/${resource}`;
  if (!pathname.startsWith(prefix)) {
    return "";
  }
  const pathnameWithoutPrefix = pathname.slice(prefix.length) || "/";
  const pathSegments = pathnameWithoutPrefix.split("/");
  const firstSegment = pathSegments[1];
  const declensions = declineNoun(resource);
  const titleMap: Record<string, string> = {
    "": `Zarządzanie ${declineNoun(resource, { case: DeclensionCase.Instrumental, plural: true })}`,
    create: `Dodawanie ${declensions.genitive}`,
    edit: `Edycja ${declensions.genitive}`,
  };
  const title = titleMap[firstSegment] ?? "";
  return title;
}

export function AbstractResourceLayout({
  resource,
  pathname,
  children,
}: {
  resource: Resource;
  pathname: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col space-y-4 py-2">
      <h2 className="bg-primary w-[20rem] max-w-full rounded-r-xl p-5 text-center text-lg font-medium whitespace-nowrap text-white sm:w-[25rem] md:w-[30rem] xl:w-[40rem]">
        {getTitle(resource, pathname)}
      </h2>
      <div className="container mx-auto flex h-full grow flex-col space-y-2 px-2 xl:px-32">
        <div className="grow">{children}</div>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary w-min"
          asChild
        >
          <Link href="/" className="">
            <ChevronsLeft />
            Wroć na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
