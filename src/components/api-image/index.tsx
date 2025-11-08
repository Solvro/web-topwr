import Image from "next/image";

import type { FileEntry } from "@/types/api";

interface ApiImagePropsBase {
  alt: string;
}

export interface ApiImageProps extends ApiImagePropsBase {
  imageKey: string;
}

export function ApiImageInternal({
  fileEntry,
  alt,
}: { fileEntry: FileEntry } & ApiImagePropsBase) {
  return (
    <Image
      src={fileEntry.url}
      alt={alt}
      className="bg-primary size-full object-contain"
      width={256}
      height={256}
    />
  );
}
