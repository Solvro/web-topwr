import { useTranslations } from "next-intl";

import { Logo } from "@/components/presentation/logo";

export function FooterBrand() {
  const t = useTranslations("Footer");

  return (
    <div>
      <Logo variant="white" className="mb-3 h-7" />
      <p className="max-w-56 text-sm">{t("brandDescription")}</p>
    </div>
  );
}
