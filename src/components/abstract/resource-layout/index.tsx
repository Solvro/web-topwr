import "server-only";

import { Bouncer } from "@/features/authentication/server";
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
