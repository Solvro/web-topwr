"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function BallpitHint() {
  const t = useTranslations("Footer");
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="border-border bg-background/80 text-muted-foreground absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-xs whitespace-nowrap backdrop-blur-md pointer-coarse:hidden">
      <p>{t("ballpitHint")}</p>
      <button
        type="button"
        aria-label={t("hideBallpitHint")}
        className="hover:bg-foreground/10 hover:text-foreground focus-visible:ring-ring flex size-5 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2"
        onClick={() => {
          setIsDismissed(true);
        }}
      >
        <XIcon className="size-3" />
      </button>
    </div>
  );
}
