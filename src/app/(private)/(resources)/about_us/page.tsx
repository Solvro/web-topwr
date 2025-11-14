import {
  Link,
  ScrollText,
  Settings,
  ShieldUser,
  UsersRound,
} from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import {
  AbstractResourceGroup,
  Resource,
  getManagingResourceLabel,
} from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function AboutUsPage(_props: ResourcePageProps) {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.AboutUs}
        icon={Settings}
        href={`/${Resource.AboutUs}/edit`}
        label={getManagingResourceLabel(Resource.AboutUs, { plural: false })}
        variant="outline"
      />
      <DashboardButton
        resource={Resource.AboutUsLinks}
        icon={Link}
        label={getManagingResourceLabel(Resource.AboutUsLinks, {
          firstWordOnly: false,
        })}
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Milestones}
        icon={ScrollText}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Contributors}
        icon={UsersRound}
        longLabel
        variant="outline"
      />
      <DashboardButton
        resource={Resource.Roles}
        icon={ShieldUser}
        longLabel
        variant="outline"
      />
    </AbstractResourceGroup>
  );
}
