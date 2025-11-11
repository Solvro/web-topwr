import { Bouncer } from "@/components/bouncer";
import type { ResourceLayoutProps } from "@/types/components";

import { AbstractResourceLayoutInternal } from "./internal";

export function AbstractResourceLayout({
  children,
  ...props
}: ResourceLayoutProps) {
  return (
    <Bouncer {...props}>
      <AbstractResourceLayoutInternal {...props}>
        {children}
      </AbstractResourceLayoutInternal>
    </Bouncer>
  );
}
