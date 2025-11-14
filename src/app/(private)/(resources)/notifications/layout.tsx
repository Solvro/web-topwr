import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function NotificationsLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout resource={Resource.Notifications} {...props} />
  );
}
