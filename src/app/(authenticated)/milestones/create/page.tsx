import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateMilestonePage() {
  return <AbstractResourceForm resource={Resource.Milestones} />;
}
