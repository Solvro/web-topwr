import { DashboardButton } from "@/components/presentation/dashboard-button";
import { AbstractResourceGroup, Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MapPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton resource={Resource.Das} longLabel variant="outline" />
      <DashboardButton
        resource={Resource.DasOrganizations}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.DasFloors}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
