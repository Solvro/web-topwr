import { NextIntlClientProvider } from "next-intl";

import { AppLayout } from "@/components/presentation/app-layout";
import { LocaleSwitcher } from "@/features/landing-page";
import type { WrapperProps } from "@/types/components";

export default function LandingLayout({ children }: WrapperProps) {
  return (
    <NextIntlClientProvider>
      <AppLayout navbarActions={<LocaleSwitcher className="rounded-full" />}>
        {children}
      </AppLayout>
    </NextIntlClientProvider>
  );
}
