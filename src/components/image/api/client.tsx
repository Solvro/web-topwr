"use client";

import Image from "next/image";

import { Spinner } from "@/components/spinner";
import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

import type { ApiImageProps } from ".";

export function ApiImage({ alt, imageKey }: ApiImageProps) {
  const { data, isSuccess, isLoading } = useQueryWrapper(
    `read__files__image__${imageKey}`,
    async () => await fetchQuery<FileEntry>(`/files/${imageKey}`),
    { staleTime: Infinity },
  );

  return isLoading ? (
    <Spinner />
  ) : isSuccess ? (
    <Image
      src={data.url}
      alt={alt}
      className="h-full max-w-full object-cover"
      width={256}
      height={256}
    />
  ) : null;
}
