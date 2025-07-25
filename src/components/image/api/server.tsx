import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

import { ApiImageCommon } from ".";
import type { ApiImageProps } from ".";

export async function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const data = await fetchQuery<FileEntry>(`/files/${imageKey}`);

  return <ApiImageCommon fileEntry={data} {...props} />;
}
