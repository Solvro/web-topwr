import { ApiImageInternal } from ".";
import type { ApiImageProps } from ".";
import { fetchFileEntry } from "./fetch-file-entry";

export async function ApiImage({ imageKey, ...props }: ApiImageProps) {
  const data = await fetchFileEntry(imageKey);
  return <ApiImageInternal fileEntry={data} {...props} />;
}
