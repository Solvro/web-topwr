import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";

import type { CreatableResource, ResourceFormValues } from "../types/internal";
import { CreateButtonLabel } from "./create-button-label";

export function CreateButton<T extends CreatableResource>({
  className,
  resource,
  prefillAttributes = {},
  plural = false,
}: {
  className?: string;
  resource: T;
  prefillAttributes?: Partial<Record<keyof ResourceFormValues<T>, string>>;
  plural?: boolean;
}) {
  const searchParameters = new URLSearchParams(
    prefillAttributes as Record<string, string>,
  );

  const searchQuery =
    searchParameters.size === 0
      ? ""
      : (`?${searchParameters.toString()}` as const);
  return (
    <Button className={className} asChild>
      <Link href={`/${resource}/create${searchQuery}`}>
        <CreateButtonLabel resource={resource} plural={plural} />
      </Link>
    </Button>
  );
}
