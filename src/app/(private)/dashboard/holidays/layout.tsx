import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function HolidaysLayout(props: WrapperProps) {
  return <AbstractResourceLayout resource={Resource.Holidays} {...props} />;
}
