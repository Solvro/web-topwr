"use client";

import type { ComponentProps } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Toaster as ShadcnToaster } from "@/components/ui/sonner";

import { useSavedToast } from "../hooks/use-saved-toast";

export function Toaster(props: ComponentProps<typeof ShadcnToaster>) {
  const savedToastReturn = useSavedToast();

  useEffect(() => {
    const { savedToast, deleteSavedToast } = savedToastReturn;
    if (savedToast == null) {
      return;
    }
    toast[savedToast.level](savedToast.message);
    deleteSavedToast();
  }, [savedToastReturn]);
  return <ShadcnToaster {...props} />;
}
