"use client";

import { Loader } from "lucide-react";
import Image from "next/image";

import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

// TODO: convert this into a server component to avoid client-side fetching
export function ApiImage({ alt, imageKey }: { alt: string; imageKey: string }) {
  const { data, isSuccess, isLoading } = useQueryWrapper(
    `read__files__image__${imageKey}`,
    async () => await fetchQuery<FileEntry>(`/files/${imageKey}`),
    { staleTime: Infinity },
  );

  return isLoading ? (
    <Loader className="animate-spin" />
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
