import type { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/app";

import { AbstractResourceLayoutTitle } from "./abstract-resource-layout-title";

export function AbstractResourceLayout({
  resource,
  children,
}: LayoutProps & {
  resource: Resource;
}) {
  return (
    <div className="flex h-full flex-col space-y-4 py-2">
      <h2 className="bg-primary w-2xs max-w-full rounded-r-xl p-3 text-center text-sm font-medium whitespace-nowrap text-white sm:w-[25rem] sm:p-5 sm:text-lg md:w-[30rem] xl:w-[40rem]">
        <AbstractResourceLayoutTitle resource={resource} />
      </h2>
      <div className="container mx-auto flex h-full grow flex-col space-y-2 px-2 xl:px-32">
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}
