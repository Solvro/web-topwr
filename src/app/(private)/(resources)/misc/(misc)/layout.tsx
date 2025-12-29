import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function MobileConfigLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.MobileConfig}
      labelOptions={{ firstWordOnly: false }}
      {...props}
    />
  );
}
