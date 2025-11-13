import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function NotificationTopicsLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout resource={Resource.NotificationTopics} {...props} />
  );
}
