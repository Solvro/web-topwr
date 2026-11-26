import { AppLayout } from "@/components/presentation/app-layout";
import { PublicLayout } from "@/features/authentication/server";
import type { WrapperProps } from "@/types/components";

export default function Layout({ children }: WrapperProps) {
  return (
    <AppLayout>
      <PublicLayout>{children}</PublicLayout>
    </AppLayout>
  );
}
