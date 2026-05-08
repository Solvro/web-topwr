import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateDasMapPage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.DasMaps} {...props} />;
}
