import {
  AppFeatures,
  Changelog,
  Contributors,
  FAQ,
  Hero,
  HeroBackground,
  LandingFooter,
} from "@/features/landing-page";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative">
        <HeroBackground />
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
