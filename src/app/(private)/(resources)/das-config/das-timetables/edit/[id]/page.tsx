import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDasTimetablePage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.DasTimetables} {...props} />
  );
}
