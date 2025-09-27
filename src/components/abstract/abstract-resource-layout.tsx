import type { ReactNode } from "react";

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
      <h2 className="bg-primary w-2xs max-w-full rounded-r-xl p-3 text-center text-sm font-medium whitespace-nowrap text-white sm:w-[25rem] sm:p-5 sm:text-lg md:w-[30rem] xl:w-[40rem]">
        {getTitle(resource, pathname)}
      </h2>
      <div className="container mx-auto flex h-full grow flex-col space-y-2 px-2 xl:px-32">
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}
