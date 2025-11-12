import { BellPlus, BellRing } from "lucide-react";

import { AbstractResourceGroup } from "@/components/abstract/resource-group";
import { DashboardButton } from "@/components/dashboard-button";
import { Resource } from "@/config/enums";
import { GrammaticalCase, declineNoun } from "@/features/polish";

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
