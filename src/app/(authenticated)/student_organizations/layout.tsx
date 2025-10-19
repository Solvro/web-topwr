import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/app";

export default function StudentOrganizationsLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.StudentOrganizations}
      {...props}
    />
  );
}
