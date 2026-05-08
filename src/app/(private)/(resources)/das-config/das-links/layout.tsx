import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function DasLinksLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.DasLinks}
      labelOptions={{ firstWordOnly: false }}
      {...props}
    />
  );
}
