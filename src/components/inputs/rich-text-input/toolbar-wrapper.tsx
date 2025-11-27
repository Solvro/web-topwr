import type { ReactNode } from "react";

interface ToolbarWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component for toolbar content with consistent styling.
 * Used by both the real TipTap toolbar and the mock toolbar skeleton.
 */
export function ToolbarWrapper({ children }: ToolbarWrapperProps) {
  return (
    <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
      <div className="flex w-max items-center gap-px">{children}</div>
    </div>
  );
}
