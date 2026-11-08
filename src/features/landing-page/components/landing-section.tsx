import type { Ref } from "react";

import { GradientText } from "@/components/fancy/gradient-text";
import { SplitText } from "@/components/fancy/split-text";
import {
  REVEAL_TRANSITION,
  VIEWPORT_OFFSET,
} from "@/features/landing-page/constants";
import { cn } from "@/lib/utils";
import type { WrapperProps } from "@/types/components";

const HOOK_GRADIENT_COLORS = [
  "var(--color-gradient-1)",
  "var(--color-gradient-2)",
];

function LandingSection({
  children,
  ref,
  className,
  containerClassName,
}: WrapperProps & {
  ref?: Ref<HTMLElement>;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <article
      ref={ref}
      className={cn("flex w-full justify-center py-20 md:py-32", className)}
    >
      <div className={cn("container flex flex-col px-4", containerClassName)}>
        {children}
      </div>
    </article>
  );
}

function LandingSectionHeader({ children }: WrapperProps) {
  return <header className="mb-12 flex flex-col gap-4">{children}</header>;
}

function LandingSectionTitle({ text, hook }: { text: string; hook?: string }) {
  return (
    <h2
      aria-label={hook == null ? text : `${text} ${hook}`}
      className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
    >
      <SplitText
        tag="span"
        text={text}
        viewportMargin={VIEWPORT_OFFSET}
        {...REVEAL_TRANSITION}
      />
      {hook == null ? null : (
        <>
          <br />
          <GradientText
            colors={HOOK_GRADIENT_COLORS}
            className="whitespace-nowrap"
          >
            {hook}
          </GradientText>
        </>
      )}
    </h2>
  );
}

function LandingSectionDescription({ children }: WrapperProps) {
  return (
    <p className="text-muted-foreground max-w-xl text-lg text-pretty">
      {children}
    </p>
  );
}

export {
  LandingSection,
  LandingSectionHeader,
  LandingSectionTitle,
  LandingSectionDescription,
};
