import { DashboardButton } from "@/components/presentation/dashboard-button";
import { AbstractResourceGroup, Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MapPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.Campuses}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Buildings}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.PolinkaStations}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.FoodSpots}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Libraries}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.BicycleShowers}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Aeds}
        longLabel
        variant="outline"
        preserveCase={true}
      />
      <DashboardButton
        resource={Resource.PinkBoxes}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
