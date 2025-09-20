import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

import { ApiImageInternal } from ".";
import type { ApiImageProps } from ".";

export async function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const data = await fetchQuery<FileEntry>(`/files/${imageKey}`);

  return <ApiImageInternal fileEntry={data} {...props} />;
}
