import { ArrowUpRightIcon, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { HeroRating } from "./hero-rating";
import { PhoneModel } from "./phone-model";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-6">
      <div className="container mx-auto grid items-center gap-12 px-4 md:px-6 lg:grid-cols-5">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
              Cały kampus PWr w&nbsp;kieszeni.
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Mapy budynków, wydarzenia i&nbsp;przewodnik po&nbsp;kampusie —
              wszystko w&nbsp;jednej, wygodnej aplikacji.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
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

        <div className="relative mx-auto flex aspect-3/4 w-full max-w-sm items-center justify-center lg:col-span-3 lg:aspect-square lg:max-w-none">
          <Image
            src="/phone-bg.svg"
            alt=""
            fill
            priority
            className="pointer-events-none -z-10 object-contain drop-shadow-[0.75rem_1rem_0.08rem_rgb(0_0_0/0.25)]"
          />
          <PhoneModel className="drop-shadow-2xl drop-shadow-black/50" />
        </div>
      </div>
    </section>
  );
}
