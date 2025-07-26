import Image from "next/image";

import type { FileEntry } from "@/types/api";

interface ApiImageInternalProps {
  alt: string;
}

export interface ApiImageProps extends ApiImageInternalProps {
  imageKey: string;
}

export function ApiImageInternal({
  fileEntry,
  alt,
}: { fileEntry: FileEntry } & ApiImageInternalProps) {
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
