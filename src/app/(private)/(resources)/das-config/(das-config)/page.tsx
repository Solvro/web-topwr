import { DashboardButton } from "@/components/presentation/dashboard-button";
import { AbstractResourceGroup, Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MapPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton resource={Resource.Das} longLabel variant="outline" />
      <DashboardButton
        resource={Resource.DasLinks}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.DasMaps}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.DasStands}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.DasTimetables}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.DasTimetableEntries}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
