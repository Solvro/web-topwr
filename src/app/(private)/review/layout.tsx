import { Bouncer } from "@/components/bouncer";
import type { LayoutProps } from "@/types/components";

export default function ReviewLayout({ children }: LayoutProps) {
  return <Bouncer route="/review">{children}</Bouncer>;
}
