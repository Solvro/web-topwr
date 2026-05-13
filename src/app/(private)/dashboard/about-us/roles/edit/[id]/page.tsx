import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditRolePage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Roles} {...props} />;
}
