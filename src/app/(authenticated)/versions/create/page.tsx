import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateVersionPage() {
  return <AbstractResourceForm resource={Resource.Versions} />;
}
