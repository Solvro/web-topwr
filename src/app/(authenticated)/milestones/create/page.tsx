import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateMilestonesPage() {
  return <AbstractResourceForm resource={Resource.Milestones} />;
}
