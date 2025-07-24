"use client";

import { Provider } from "jotai";
import type { ReactNode } from "react";

//for the rich text editor
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/query-client";
import { globalStore } from "@/stores/global";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={globalStore}>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
    </Provider>
  );
}
