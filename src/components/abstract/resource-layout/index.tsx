import { ApplicationError } from "@/config/enums";
import { permit } from "@/lib/data-access";
import type { ResourceLayoutProps } from "@/types/components";

import { ErrorMessage } from "../../error-message";
import { AbstractResourceLayoutInternal } from "./internal";

export async function AbstractResourceLayout(props: ResourceLayoutProps) {
  const hasPermission = await permit(`/${props.resource}`);
  if (!hasPermission) {
    return <ErrorMessage type={ApplicationError.Forbidden} />;
  }

  return <AbstractResourceLayoutInternal {...props} />;
}
