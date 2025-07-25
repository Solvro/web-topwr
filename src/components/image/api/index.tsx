import Image from "next/image";

import type { FileEntry } from "@/types/api";

interface ApiImageCommonProps {
  alt: string;
}

export interface ApiImageProps extends ApiImageCommonProps {
  imageKey: string;
}

export function ApiImageCommon({
  fileEntry,
  alt,
}: { fileEntry: FileEntry } & ApiImageCommonProps) {
  return (
    <Image
      src={fileEntry.url}
      alt={alt}
      className="h-full max-w-full object-cover"
      width={256}
      height={256}
    />
  );
}
