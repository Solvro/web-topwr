import { BellRing } from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import { ADMIN_PATH } from "@/config/constants";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { AbstractResourceGroup, Resource } from "@/features/resources";

export default function NotificationsPage() {
  return (
    <AbstractResourceGroup>
      <DashboardButton
        resource={Resource.NotificationTopics}
        variant="outline"
        longLabel
      />
      <DashboardButton
        resource={Resource.Notifications}
        variant="outline"
        icon={BellRing}
        label={`Wyślij ${declineNoun(Resource.Notifications, { case: GrammaticalCase.Nominative })}`}
        href={`${ADMIN_PATH}/${Resource.Notifications}/create`}
      />
    </AbstractResourceGroup>
  );
}
