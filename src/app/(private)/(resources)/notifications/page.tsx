import { BellPlus, BellRing } from "lucide-react";

import { AbstractResourceGroup } from "@/components/abstract/resource-group";
import { DashboardButton } from "@/components/dashboard-button";
import { GrammaticalCase, Resource } from "@/config/enums";
import { declineNoun } from "@/lib/polish";

export default function NotificationsPage() {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.NotificationTopics}
        variant="outline"
        icon={BellPlus}
        longLabel
      />
      <DashboardButton
        resource={Resource.Notifications}
        variant="outline"
        icon={BellRing}
        label={`Wyślij ${declineNoun(Resource.Notifications, { case: GrammaticalCase.Nominative })}`}
        href={`/${Resource.Notifications}/create`}
      />
    </AbstractResourceGroup>
  );
}
