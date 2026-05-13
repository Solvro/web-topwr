import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function BicycleShowersLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout resource={Resource.BicycleShowers} {...props} />
  );
}
