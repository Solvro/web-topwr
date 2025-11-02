import type { ResourceLayoutProps } from "@/types/components";

import { AbstractResourceLayoutTitle } from "./title";

export function AbstractResourceLayoutInternal({
  resource,
  children,
  labelOptions = {},
}: ResourceLayoutProps) {
  return (
    <div className="flex h-full flex-col space-y-4 pt-2 pb-4">
      <h2 className="bg-primary w-2xs max-w-full rounded-r-xl p-3 text-center text-sm font-medium whitespace-nowrap text-white sm:w-[25rem] sm:p-5 sm:text-lg md:w-[30rem] xl:w-[40rem]">
        <AbstractResourceLayoutTitle
          resource={resource}
          labelOptions={labelOptions}
        />
      </h2>
      <div className="container mx-auto flex h-full grow flex-col space-y-2 px-2 xl:px-32">
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}
