import { fetchFileEntry } from "@/features/backend";

import { ApiImageInternal } from ".";
import type { ApiImageProps } from ".";

export async function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const data = await fetchFileEntry(imageKey);
  return <ApiImageInternal fileEntry={data} {...props} />;
}
