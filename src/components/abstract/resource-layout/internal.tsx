import type { ResourceLayoutProps } from "@/types/components";

import { AbstractResourceLayoutTitle } from "./title";

export function AbstractResourceLayoutInternal({
  resource,
  header,
  route,
  children,
  labelOptions = {},
}: ResourceLayoutProps) {
  const identifier = route ?? resource;
  return (
    <section className="flex h-full flex-col space-y-4 pt-2 pb-4">
      <header
        className="bg-primary text-primary-foreground flex w-2xs max-w-full justify-center rounded-r-xl p-3 text-sm font-medium whitespace-nowrap sm:w-[25rem] sm:p-5 sm:text-lg md:w-[30rem] xl:w-[40rem]"
        style={{
          viewTransitionName: `resource-card-${identifier}`,
        }}
      >
        <h1 style={{ viewTransitionName: `resource-title-${identifier}` }}>
          {header ?? route ?? (
            <AbstractResourceLayoutTitle
              resource={resource}
              labelOptions={labelOptions}
            />
          )}
        </h1>
      </header>
      <div className="container mx-auto flex h-full grow flex-col space-y-2 px-2 xl:px-32">
        <div className="grow">{children}</div>
      </div>
    </section>
  );
}
