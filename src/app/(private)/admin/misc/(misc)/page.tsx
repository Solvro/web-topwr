import { DashboardButton } from "@/components/presentation/dashboard-button";
import { ADMIN_PATH } from "@/config/constants";
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
        href={`${ADMIN_PATH}/${Resource.MobileConfig}/edit`}
        label="Zarządzanie ustawieniami"
        variant="outline"
      />
      <DashboardButton
        resource={Resource.SksOpeningHours}
        label={getManagingResourceLabel(Resource.SksOpeningHours, {
          firstWordOnly: false,
        })}
        variant="outline"
        preserveCase
      />
    </AbstractResourceGroup>
  );
}
