"use client";

import { Spinner } from "@/components/core/spinner";

import { fetchFileEntry } from "../api/fetch-file-entry";
import { useQueryWrapper } from "../hooks/use-query-wrapper";
import type { ApiImageProps } from "../types/internal";
import { ApiImageInternal } from "./api-image";

export function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const { data, isSuccess, isPending } = useQueryWrapper(
    `read__files__image__${imageKey}`,
    async () => await fetchFileEntry(imageKey),
    { staleTime: Infinity },
  );

  return isPending ? (
    <Spinner />
  ) : isSuccess ? (
    <ApiImageInternal fileEntry={data} {...props} />
  ) : null;
}
