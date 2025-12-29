import { Clock, Wrench } from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import {
  AbstractResourceGroup,
  Resource,
  getManagingResourceLabel,
} from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MobileConfigPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.MobileConfig}
        icon={Wrench}
        href={`/${Resource.MobileConfig}/edit`}
        label="Zarządzanie ustawieniami"
        variant="outline"
      />
      <DashboardButton
        resource={Resource.SksOpeningHours}
        icon={Clock}
        label={getManagingResourceLabel(Resource.SksOpeningHours, {
          firstWordOnly: false,
        })}
        variant="outline"
        preserveCase
      />
    </AbstractResourceGroup>
  );
}
