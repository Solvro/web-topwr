import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDaySwapPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.DaySwaps} {...props} />;
}
