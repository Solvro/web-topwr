import { Resource } from "@/features/resources";
import { AbstractResourceEditPage } from "@/features/resources/server";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditBannerPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Banners} {...props} />;
}
