import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDasStandPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.DasStands} {...props} />;
}
