import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateBannerPage() {
  return <AbstractResourceForm resource={Resource.Banners} />;
}
