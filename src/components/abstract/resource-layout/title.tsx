"use client";

import { usePathname } from "next/navigation";

import type { Resource } from "@/config/enums";
import { getManagingResourceLabel } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { ResourceLabelOptions } from "@/types/components";

function getTitle(
  resource: Resource,
  pathname: string,
  labelOptions: ResourceLabelOptions,
): string {
  const prefix = `/${resource}`;
  if (!pathname.startsWith(prefix)) {
    return "";
  }
  const pathnameWithoutPrefix = pathname.slice(prefix.length) || "/";
  const pathSegments = pathnameWithoutPrefix.split("/");
  const firstSegment = pathSegments[1];
  const declensions = declineNoun(resource);
  const titleMap: Record<string, string> = {
    "": getManagingResourceLabel(resource, labelOptions),
    create: `Dodawanie ${declensions.genitive}`,
    edit: `Edycja ${declensions.genitive}`,
  };
  const title = titleMap[firstSegment] ?? "";
  return title;
}

export function AbstractResourceLayoutTitle({
  resource,
  labelOptions,
}: {
  resource: Resource;
  labelOptions: ResourceLabelOptions;
}) {
  const pathname = usePathname();
  return getTitle(resource, pathname, labelOptions);
}
