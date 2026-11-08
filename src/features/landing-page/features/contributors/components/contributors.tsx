import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MOBILE_REPOSITORY_URL } from "@/config/constants";
import { GITHUB_LOGOS } from "@/data/github-logos";
import { fetchResources } from "@/features/backend";
import {
  LandingSection,
  LandingSectionDescription,
  LandingSectionHeader,
  LandingSectionTitle,
} from "@/features/landing-page/components";
import { Resource } from "@/features/resources";

import { AnimatedContributorList } from "./animated-contributor-list";

export async function Contributors() {
  const t = await getTranslations("Contributors");
  const contributors = await fetchResources(Resource.Contributors, true);

  return (
    <LandingSection
      className="border-border border-b"
      containerClassName="items-center text-center"
    >
      <LandingSectionHeader>
        <LandingSectionTitle text={t("title")} />
        <LandingSectionDescription>
          {t("description")}
        </LandingSectionDescription>
      </LandingSectionHeader>

      <AnimatedContributorList contributors={contributors} className="mb-12" />

      <Button variant="outline" className="rounded-full px-4 text-xs" asChild>
        <Link
          href={MOBILE_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={GITHUB_LOGOS[0].src}
            alt={GITHUB_LOGOS[0].alt}
            className="size-5 rounded-full dark:hidden"
          />
          <Image
            src={GITHUB_LOGOS[1].src}
            alt={GITHUB_LOGOS[1].alt}
            className="size-5 rounded-full not-dark:hidden"
          />
          {t("starOnGithub")}
        </Link>
      </Button>
    </LandingSection>
  );
}
