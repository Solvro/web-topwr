import { fetchFileEntry } from "../api/fetch-file-entry";
import type { ApiImageProps } from "../types/internal";
import { ApiImageInternal } from "./api-image";

export async function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const data = await fetchFileEntry(imageKey);
  return <ApiImageInternal fileEntry={data} {...props} />;
}
