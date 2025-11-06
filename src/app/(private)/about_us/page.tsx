import {
  Link,
  ScrollText,
  Settings,
  ShieldUser,
  UsersRound,
} from "lucide-react";

import { BackToHomeButton } from "@/components/abstract/back-to-home-button";
import { DashboardButton } from "@/components/dashboard-button";
import { Resource } from "@/config/enums";
import { getManagingResourceLabel } from "@/lib/helpers";
import type { ResourcePageProps } from "@/types/components";

export default function AboutUsPage(_props: ResourcePageProps) {
  return (
    <div className="flex h-full flex-col items-start gap-4 sm:pt-4 lg:pt-16">
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
      <BackToHomeButton className="mt-auto" chevronsIcon />
    </div>
  );
}
