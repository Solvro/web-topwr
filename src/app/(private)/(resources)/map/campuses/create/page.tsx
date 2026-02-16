import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateCampusPage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.Campuses} {...props} />;
}
