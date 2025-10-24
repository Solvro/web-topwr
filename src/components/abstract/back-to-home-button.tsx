import { ChevronsLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function BackToHomeButton() {
  return (
    <Button variant="link" asChild className="w-fit">
      <Link href="/">
        <ChevronsLeft />
        Wróć na stronę główną
      </Link>
    </Button>
  );
}
