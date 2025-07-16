import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ERROR_CODES } from "@/config/constants";
import type { ErrorCode } from "@/types/app";

export function ErrorMessage({ code }: { code: ErrorCode }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col justify-center">
        <h2 className="-mt-18 text-center text-5xl font-semibold">{code}</h2>
        <p className="mt-2 text-center">{ERROR_CODES[code]}</p>
        <Button variant="ghost" asChild className="mt-8">
          <Link className="" href="/">
            <ArrowLeft />
            Powrót na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
