"use client";

import type { ComponentProps } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Toaster as ShadcnToaster } from "@/components/ui/sonner";

import { deleteSavedToast } from "../utils/delete-saved-toast";
import { parseSavedToast } from "../utils/parse-saved-toast";

export function Toaster(props: ComponentProps<typeof ShadcnToaster>) {
  useEffect(() => {
    const savedToast = parseSavedToast();
    if (savedToast == null) {
      return;
    }
    toast[savedToast.level](savedToast.message);
    deleteSavedToast();
  }, []);
  return <ShadcnToaster {...props} />;
}
