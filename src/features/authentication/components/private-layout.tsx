import "server-only";

import { Resource } from "@/features/resources";
import type { WrapperProps } from "@/types/components";

import { Bouncer } from "./bouncer";

export function PrivateLayout({ children }: WrapperProps) {
  return <Bouncer route={`/${Resource.Dashboard}`}>{children}</Bouncer>;
}
