import Image from "next/image";
import type { CSSProperties, ComponentProps } from "react";

import { ImageType } from "@/config/enums";
import type { FileEntry } from "@/features/backend/types";
import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { cn } from "@/lib/utils";

interface ApiImagePropsBase extends Omit<ComponentProps<typeof Image>, "src"> {
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
  className,
  style,
  ...props
}: { fileEntry: FileEntry } & ApiImagePropsBase) {
  const backgroundColor = getBackgroundColor(resourceData);
  return (
    <Image
      src={fileEntry.url}
      className={cn(
        "dark:bg-accent-foreground size-full",
        type === ImageType.Logo ? "object-contain p-1 sm:p-2" : "object-cover",
        className,
      )}
      style={{ ...backgroundColor, ...style }}
      width={256}
      height={256}
      {...props}
    />
  );
}
