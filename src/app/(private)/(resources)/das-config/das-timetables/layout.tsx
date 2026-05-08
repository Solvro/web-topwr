import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function DasTimetablesLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.DasTimetables}
      labelOptions={{ firstWordOnly: false }}
      {...props}
    />
  );
}
