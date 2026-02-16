import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditBicycleShowerPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.BicycleShowers} {...props} />
  );
}
