import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditFoodSpotPage(props: ResourceEditPageProps) {
  return <AbstractResourceEditPage resource={Resource.FoodSpots} {...props} />;
}
