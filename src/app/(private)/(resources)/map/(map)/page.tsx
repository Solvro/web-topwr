import {
  Building,
  Map,
  MapPin,
  Slice,
  Train,
  UtensilsCrossed,
} from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import { AbstractResourceGroup, Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MapPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.Campuses}
        icon={Map}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Buildings}
        icon={Building}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.PolinkaStations}
        icon={Train}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.FoodSpots}
        icon={UtensilsCrossed}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Libraries}
        icon={MapPin}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.BicycleShowers}
        icon={MapPin}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Aeds}
        icon={MapPin}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.PinkBoxes}
        icon={Slice}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
