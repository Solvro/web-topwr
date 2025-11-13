import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function VersionsLayout(props: WrapperProps) {
  return <AbstractResourceLayout resource={Resource.Versions} {...props} />;
}
