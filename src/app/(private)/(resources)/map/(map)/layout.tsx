import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function MapLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.Map}
      labelOptions={{ firstWordOnly: false }}
      {...props}
    />
  );
}
