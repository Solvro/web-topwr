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
    <header className="mb-12">
      <h2 className="mb-4 max-w-2xl text-4xl font-medium sm:text-5xl">
        {title}
        {hook == null ? null : (
          <>
            <br />
            <span className="text-primary whitespace-nowrap">{hook}</span>
          </>
        )}
      </h2>
      {description == null ? null : (
        <p className="text-muted-foreground max-w-xl text-lg">{description}</p>
      )}
    </header>
  );
}
