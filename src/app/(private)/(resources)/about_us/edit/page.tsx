import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function AboutUsEditPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.AboutUs} {...props} />;
}
