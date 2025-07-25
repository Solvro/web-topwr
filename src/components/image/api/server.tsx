import Image from "next/image";

import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

import type { ApiImageProps } from ".";

export async function ApiImage({ alt, imageKey }: ApiImageProps) {
  const response = await fetchQuery<FileEntry>(`/files/${imageKey}`);

  return (
    <Image
      src={response.url}
      alt={alt}
      className="h-full max-w-full object-cover"
      width={256}
      height={256}
    />
  );
}
