import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditAedPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Aeds} {...props} />;
}
