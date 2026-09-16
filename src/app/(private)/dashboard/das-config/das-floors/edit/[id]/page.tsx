import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function DasFloorsEditPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.DasFloors} {...props} />;
}
