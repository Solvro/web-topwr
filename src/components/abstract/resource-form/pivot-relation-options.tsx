"use client";

import { SelectItem } from "@/components/ui/select";
import type { Resource } from "@/config/enums";
import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchResources, getKey, getResourceMetadata } from "@/lib/helpers";

export function PivotRelationOptions({ resource }: { resource: Resource }) {
  // TODO: make this data available server-side, not with a client query
  const { data } = useQueryWrapper(
    getKey.query.resourceList(resource),
    async () => fetchResources(resource),
  );

  const metadata = getResourceMetadata(resource);

  if (data == null) {
    return null;
  }

  return data.data.map((item) => (
    <SelectItem key={item.id} value={String(item.id)}>
      {metadata.itemMapper(item).name}
    </SelectItem>
  ));
}
