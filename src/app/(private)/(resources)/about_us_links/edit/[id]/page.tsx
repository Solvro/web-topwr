import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditAboutUsLinkPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.AboutUsLinks} {...props} />
  );
}
