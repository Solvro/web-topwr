"use client";

import { Spinner } from "@/components/spinner";
import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

import { ApiImageCommon } from ".";
import type { ApiImageProps } from ".";

export function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const { data, isSuccess, isLoading } = useQueryWrapper(
    `read__files__image__${imageKey}`,
    async () => await fetchQuery<FileEntry>(`/files/${imageKey}`),
    { staleTime: Infinity },
  );

  return isLoading ? (
    <Spinner />
  ) : isSuccess ? (
    <ApiImageCommon fileEntry={data} {...props} />
  ) : null;
}
