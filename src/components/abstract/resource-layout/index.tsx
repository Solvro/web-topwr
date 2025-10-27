import { ApplicationError } from "@/config/enums";
import { permit } from "@/lib/data-access";
import type { RoutableResource } from "@/types/app";
import type { LayoutProps } from "@/types/components";

import { ErrorMessage } from "../../error-message";
import { AbstractResourceLayoutInternal } from "./internal";

export async function AbstractResourceLayout({
  resource,
  children,
}: LayoutProps & {
  resource: RoutableResource;
}) {
  const hasPermission = await permit(`/${resource}`);
  if (!hasPermission) {
    return <ErrorMessage type={ApplicationError.Forbidden} />;
  }

  return (
    <AbstractResourceLayoutInternal resource={resource}>
      {children}
    </AbstractResourceLayoutInternal>
  );
}
