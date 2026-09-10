import { AppFeatures, Contributors, FAQ, Hero } from "@/features/landing-page";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Hero />
      <AppFeatures />
      <Contributors />
      <FAQ />
    </div>
  );
}
