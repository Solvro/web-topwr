import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function HolidaysPage(props: ResourcePageProps) {
  return <AbstractResourceList resource={Resource.Holidays} {...props} />;
}
