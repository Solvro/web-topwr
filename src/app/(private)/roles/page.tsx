import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function RolesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Roles}
      parentResource={Resource.AboutUs}
      {...props}
    />
  );
}
