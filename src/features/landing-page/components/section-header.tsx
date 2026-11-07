import { GradientText } from "@/components/fancy/gradient-text";
import { SplitText } from "@/components/fancy/split-text";
import {
  REVEAL_TRANSITION,
  VIEWPORT_OFFSET,
} from "@/features/landing-page/constants";

const HOOK_GRADIENT_COLORS = [
  "var(--color-gradient-1)",
  "var(--color-gradient-2)",
];

export function SectionHeader({
  title,
  hook,
  description,
}: {
  title: string;
  hook?: string;
  description?: string;
}) {
  return (
    <header className="mb-12 flex flex-col gap-4">
      <h2
        aria-label={hook == null ? title : `${title} ${hook}`}
        className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
      >
        <SplitText
          tag="span"
          text={title}
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
      {description == null ? null : (
        <p className="text-muted-foreground max-w-xl text-lg text-pretty">
          {description}
        </p>
      )}
    </header>
  );
}
