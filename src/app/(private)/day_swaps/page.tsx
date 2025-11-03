import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function DaySwapsPage(props: ResourcePageProps) {
  return <AbstractResourceList resource={Resource.DaySwaps} {...props} />;
}
