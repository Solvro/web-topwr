import { Bouncer } from "@/components/bouncer";
import type { ResourceLayoutProps } from "@/types/components";

import { AbstractResourceLayoutInternal } from "./internal";

export function AbstractResourceLayout(props: ResourceLayoutProps) {
  return (
    <Bouncer resource={props.resource}>
      <AbstractResourceLayoutInternal {...props} />
    </Bouncer>
  );
}
