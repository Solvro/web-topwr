import Image from "next/image";

import {
  AppFeatures,
  Changelog,
  Contributors,
  FAQ,
  Hero,
  LandingFooter,
} from "@/features/landing-page";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative">
        <Image
          src="/bg.svg"
          alt=""
          width={2071}
          height={4571}
          priority
          className="pointer-events-none absolute -top-17 right-0 -z-10 h-[175%] w-auto max-w-none drop-shadow-[-0.2rem_-0.7rem_0.05rem_rgb(175_67_43)] max-lg:-right-48"
        />
        <Hero />
      </div>
      <AppFeatures />
      <Changelog />
      <Contributors />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
