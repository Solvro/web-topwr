import type { ReactNode } from "react";

export function FooterAffiliation({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3">
      <span className="text-xs tracking-wide">{label}</span>
      {children}
    </div>
  );
}
