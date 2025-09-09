import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateGuideArticlePage() {
  return <AbstractResourceForm resource={Resource.GuideArticles} />;
}
