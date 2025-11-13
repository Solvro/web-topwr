"use client";

import { Spinner } from "@/components/core/spinner";
import { fetchFileEntry, useQueryWrapper } from "@/features/backend";

import { ApiImageInternal } from ".";
import type { ApiImageProps } from ".";

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
