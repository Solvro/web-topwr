import { Resource } from "@/features/resources";
import { AbstractResourceEditPage } from "@/features/resources/server";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditHolidayPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Holidays} {...props} />;
}
