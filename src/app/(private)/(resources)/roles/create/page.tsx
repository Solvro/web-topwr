import { Resource } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateRolePage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.Roles} {...props} />;
}
