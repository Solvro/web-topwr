import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateChangesPage() {
  return <AbstractResourceForm resource={Resource.Changes} />;
}
