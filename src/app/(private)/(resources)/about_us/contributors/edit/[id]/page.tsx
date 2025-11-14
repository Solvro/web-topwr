import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditContributorPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.Contributors} {...props} />
  );
}
