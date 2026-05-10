import { ArrowRight, Wrench } from "lucide-react";
import "server-only";

import { Link } from "@/components/core/link";
import { Logo } from "@/components/presentation/logo";
import { Button } from "@/components/ui/button";
import { ADMIN_PATH } from "@/config/constants";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="-mt-18 text-5xl font-semibold">
          <Logo variant="dynamic" className="h-auto w-full" />
        </h2>
        <p className="text-muted-foreground flex flex-row items-center gap-1 text-center text-balance">
          Strona główna w budowie <Wrench className="size-4" />
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href={ADMIN_PATH}>
              Przejdź do panelu admina <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
