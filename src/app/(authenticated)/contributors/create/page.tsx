import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateContributorPage() {
  return <AbstractResourceForm resource={Resource.Contributors} />;
}
