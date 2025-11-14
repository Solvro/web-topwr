import { BellPlus, BellRing } from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { AbstractResourceGroup, Resource } from "@/features/resources";

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
