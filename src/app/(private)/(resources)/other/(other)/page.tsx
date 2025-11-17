import { Link, Settings } from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import { AbstractResourceGroup, Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function AboutUsPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.MobileConfig}
        icon={Link}
        href={`/${Resource.MobileConfig}/edit`}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.SksOpeningHours}
        icon={Settings}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
