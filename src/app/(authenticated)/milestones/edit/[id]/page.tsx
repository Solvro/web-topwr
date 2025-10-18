import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";
import type { ResourceEditPageProps } from "@/types/app";

export default function EditMilestonesPage({ params }: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.Milestones} params={params} />
  );
}
