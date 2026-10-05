import { SectionHeader } from "@/features/landing-page/components";

import { Questions } from "./questions";

export function FAQ() {
  return (
    <article className="flex w-full flex-col items-center justify-center py-20">
      <div className="container flex max-w-6xl flex-col px-4 md:px-6 lg:flex-row lg:gap-16">
        <SectionHeader
          title={
            <>
              Twoje Pytania
              <br />
              o&nbsp;ToPWR,
            </>
          }
          hook="z odpowiedziami"
        />
        <div className="flex-1">
          <Questions />
        </div>
      </div>
    </article>
  );
}
