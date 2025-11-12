import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

export default function NotificationsLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout resource={Resource.Notifications} {...props} />
  );
}
