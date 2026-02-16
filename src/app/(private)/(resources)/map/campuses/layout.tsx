import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function CampusesLayout(props: WrapperProps) {
  return <AbstractResourceLayout resource={Resource.Campuses} {...props} />;
}
