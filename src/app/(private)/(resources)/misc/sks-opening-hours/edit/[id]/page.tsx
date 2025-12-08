import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditSksOpeningHoursPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.SksOpeningHours} {...props} />
  );
}
