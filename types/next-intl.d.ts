import type { Locale, LocaleMessages } from "@/features/landing-page";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: LocaleMessages;
  }
}
