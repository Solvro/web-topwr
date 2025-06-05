import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col justify-center">
        <h2 className="-mt-18 text-center text-5xl font-semibold">404</h2>
        <p className="mt-2 text-center">Nie znaleziono podanej strony</p>
        <Button variant="ghost" asChild className="mt-8">
          <Link className="" href="/">
            <ArrowLeft></ArrowLeft>
            Powrót na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
