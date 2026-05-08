import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDasPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Das} {...props} />;
}
