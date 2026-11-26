"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { setLocale } from "../actions/set-locale";
import { LOCALES, LOCALE_NAMES } from "../constants";

export function LocaleSwitcher(props: ComponentProps<typeof Button>) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          tooltip={LOCALE_NAMES[currentLocale]}
          disabled={isPending}
          {...props}
        >
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            lang={locale}
            onClick={() => {
              startTransition(async () => {
                await setLocale(locale);
              });
            }}
          >
            {LOCALE_NAMES[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
