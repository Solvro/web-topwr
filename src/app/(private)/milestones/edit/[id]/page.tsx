import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditMilestonePage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Milestones} {...props} />;
}
