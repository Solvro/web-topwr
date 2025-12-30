import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditCampusPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Campuses} {...props} />;
}
