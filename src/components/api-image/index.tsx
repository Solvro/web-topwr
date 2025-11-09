import Image from "next/image";
import type { CSSProperties } from "react";

import type { Resource } from "@/config/enums";
import { ImageType } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { FileEntry } from "@/types/api";
import type { ResourceFormValues } from "@/types/app";

interface ApiImagePropsBase {
  alt: string;
  resourceData?: ResourceFormValues<Resource>;
  type: ImageType;
}

export interface ApiImageProps extends ApiImagePropsBase {
  imageKey: string;
}

const getBackgroundColor = (
  resourceData?: ResourceFormValues<Resource>,
): CSSProperties => {
  if (resourceData == null) {
    return {};
  }
  if ("gradientStart" in resourceData && resourceData.gradientStart != null) {
    return "gradientStop" in resourceData && resourceData.gradientStop != null
      ? {
          background: `linear-gradient(to bottom right, ${resourceData.gradientStart}, ${resourceData.gradientStop})`,
        }
      : { background: resourceData.gradientStart };
  }
  return {};
};

export function ApiImageInternal({
  resourceData,
  fileEntry,
  type,
  alt,
}: { fileEntry: FileEntry } & ApiImagePropsBase) {
  const backgroundColor = getBackgroundColor(resourceData);
  return (
    <Image
      src={fileEntry.url}
      alt={alt}
      className={cn(
        "dark:bg-accent-foreground size-full",
        type === ImageType.Logo ? "object-contain p-1 sm:p-2" : "object-cover",
      )}
      style={backgroundColor}
      width={256}
      height={256}
    />
  );
}
