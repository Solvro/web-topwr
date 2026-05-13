import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditLibraryPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Libraries} {...props} />;
}
