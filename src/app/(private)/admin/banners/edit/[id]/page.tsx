import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditBannerPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Banners} {...props} />;
}
