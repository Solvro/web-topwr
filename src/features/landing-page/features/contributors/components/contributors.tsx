import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MOBILE_REPOSITORY_URL } from "@/config/constants";
import { GITHUB_LOGOS } from "@/data/github-logos";
import { fetchResources } from "@/features/backend";
import { Resource } from "@/features/resources";

import { AnimatedContributorList } from "./animated-contributor-list";

export async function Contributors() {
  const contributors = await fetchResources(Resource.Contributors, true);

  return (
    <article className="flex w-full flex-col items-center justify-center py-20">
      <div className="container flex max-w-4xl flex-col items-center px-4 text-center md:px-6">
        <h2 className="mb-4 text-4xl font-medium sm:text-5xl">Nasi twórcy</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl text-lg">
          Studenci Politechniki Wrocławskiej, którzy budują to dla ciebie.
        </p>

        <AnimatedContributorList
          contributors={contributors}
          className="mb-12"
        />

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
            Oznacz gwiazdką na GitHubie
          </Link>
        </Button>
      </div>
    </article>
  );
}
