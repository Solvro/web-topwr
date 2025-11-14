import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditMilestonePage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Milestones} {...props} />;
}
