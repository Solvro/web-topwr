import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";

export const getResourceEndpointPrefix = (
  resource: Resource | undefined,
  draft: boolean,
) => {
  if (resource == null) {
    return "";
  }
  const metadata = getResourceMetadata(resource);
  const draftPath = draft ? metadata.apiDraftPath : null;
  return `${draftPath ?? metadata.apiPath}/`;
};
