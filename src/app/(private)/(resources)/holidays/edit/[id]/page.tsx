import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditHolidayPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Holidays} {...props} />;
}
