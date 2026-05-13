import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function MobileConfigEditPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.MobileConfig} {...props} />
  );
}
