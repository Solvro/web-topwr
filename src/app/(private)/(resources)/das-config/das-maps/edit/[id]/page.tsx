import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDasMapPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.DasMaps} {...props} />;
}
