import { ArrowUpRightIcon, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { HeroRating } from "./hero-rating";
import { PhoneModel } from "./phone-model";

export function Hero() {
  return (
    <section className="h-[calc(100dvh-(--spacing(17)))] min-h-152 w-full">
      <div className="container mx-auto grid h-full items-center gap-6 px-4 py-6 max-lg:grid-rows-[auto_minmax(0,1fr)] md:px-6 lg:grid-cols-5 lg:gap-12">
        <div className="flex flex-col gap-6 max-lg:items-center max-lg:text-center lg:col-span-2 lg:gap-8">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl xl:text-7xl">
              Cały kampus PWr{" "}
              <span className="from-gradient-1 to-gradient-2 bg-linear-to-r bg-clip-text text-transparent">
                w&nbsp;kieszeni.
              </span>
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Mapy budynków, wydarzenia i&nbsp;przewodnik po&nbsp;kampusie —
              wszystko w&nbsp;jednej, wygodnej aplikacji.
            </p>
          </div>

          <div className="flex gap-3 max-sm:w-full max-sm:flex-col sm:gap-4">
            <Button size="lg" className="rounded-full py-6">
              <Download className="size-5" />
              Pobierz aplikację
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full py-6"
              asChild
            >
              <Link href="https://topwr.solvro.pl/" target="_blank">
                Zobacz, jak działa <ArrowUpRightIcon />
              </Link>
            </Button>
          </div>

          <HeroRating />
        </div>

        <div className="relative flex size-full max-h-192 items-center justify-center lg:col-span-3">
          <Image
            src="/phone-bg.svg"
            alt=""
            fill
            priority
            className="pointer-events-none object-contain drop-shadow-[0.75rem_1rem_0.08rem_rgb(0_0_0/0.25)]"
          />
          <PhoneModel className="drop-shadow-2xl drop-shadow-black/50" />
        </div>
      </div>
    </section>
  );
}
