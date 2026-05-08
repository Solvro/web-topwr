import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDasLinkPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.DasLinks} {...props} />;
}
