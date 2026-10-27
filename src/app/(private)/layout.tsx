import type { Metadata } from "next";

import { AppLayout } from "@/components/presentation/app-layout";
import { PrivateLayout } from "@/features/authentication/server";
import type { WrapperProps } from "@/types/components";

export const metadata: Metadata = {
  title: "ToPWR | Panel Administratora",
};

export default function Layout({ children }: WrapperProps) {
  return (
    <AppLayout>
      <PrivateLayout>{children}</PrivateLayout>
    </AppLayout>
  );
}
