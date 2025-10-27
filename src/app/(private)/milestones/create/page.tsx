import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateMilestonePage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.Milestones} {...props} />;
}
