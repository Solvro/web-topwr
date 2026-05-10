import "server-only";

import { ADMIN_PATH } from "@/config/constants";
import type { WrapperProps } from "@/types/components";

import { Bouncer } from "./bouncer";

export function PrivateLayout({ children }: WrapperProps) {
  return <Bouncer route={ADMIN_PATH}>{children}</Bouncer>;
}
