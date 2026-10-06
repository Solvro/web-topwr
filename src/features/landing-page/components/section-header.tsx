import type { ReactNode } from "react";

export function SectionHeader({
  title,
  hook,
  description,
}: {
  title: ReactNode;
  hook?: string;
  description?: string;
}) {
  return (
    <header className="mb-12 flex flex-col gap-4">
      <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
        {hook == null ? null : (
          <>
            <br />
            <span className="from-gradient-1 to-gradient-2 bg-linear-to-r bg-clip-text whitespace-nowrap text-transparent">
              {hook}
            </span>
          </>
        )}
      </h2>
      {description == null ? null : (
        <p className="text-muted-foreground max-w-xl text-lg text-pretty">
          {description}
        </p>
      )}
    </header>
  );
}
