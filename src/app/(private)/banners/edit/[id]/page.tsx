import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditBannerPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.Banners} {...props} />;
}
