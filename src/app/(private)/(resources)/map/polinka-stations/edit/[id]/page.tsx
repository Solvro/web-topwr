import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditPolinkaStationPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.PolinkaStations} {...props} />
  );
}
