import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditVersionPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Versions} {...props} />;
}
