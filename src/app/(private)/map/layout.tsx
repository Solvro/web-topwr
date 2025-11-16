import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function MapLayout(props: WrapperProps) {
  return (
    <AbstractResourceLayout route="/map" header="Mapa obiektów" {...props} />
  );
}
