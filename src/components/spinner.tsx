import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className = "" }: { className?: string }) {
  return <LoaderCircle className={cn("animate-spin", className)} />;
}
