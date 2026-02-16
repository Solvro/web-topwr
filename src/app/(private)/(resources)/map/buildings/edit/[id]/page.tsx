import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditBuildingPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Buildings} {...props} />;
}
