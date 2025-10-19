"use client";

import { usePathname } from "next/navigation";

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

export function AbstractResourceLayoutTitle({
  resource,
}: {
  resource: Resource;
}) {
  const pathname = usePathname();
  return getTitle(resource, pathname);
}
