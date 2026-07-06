import {
  AuthorsSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  MoreFeaturesSection,
} from "@/features/landing-page";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeroSection />
      <FeaturesSection />
      <MoreFeaturesSection />
      <AuthorsSection />
      <FAQSection />
    </div>
  );
}
