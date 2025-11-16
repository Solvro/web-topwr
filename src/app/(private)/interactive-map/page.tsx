import { BackToHomeButton } from "@/components/presentation/back-to-home-button";
import { AbstractResourceMap } from "@/features/abstract-resource-map";

export default function MapPage() {
  return (
    // TODO: deduplicate this container wrapper
    <div className="flex h-full flex-col justify-between gap-2">
      <AbstractResourceMap />
      <BackToHomeButton chevronsIcon className="self-start" />
    </div>
  );
}
