import type { ReactNode } from "react";

import type { Resource } from "@/config/enums";
import { typedEntries } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { LayoutProps } from "@/types/components";
import type { AbstractResourceFormInputs } from "@/types/forms";
import type { ValueOf } from "@/types/helpers";

type SynchronousReactNode = Exclude<ReactNode, Promise<ReactNode>>;

export function InputRow({
  children,
  className,
}: LayoutProps & {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-row flex-wrap gap-4", className)}>
      {children}
    </div>
  );
}

export function Inputs<
  T extends Resource,
  Y extends ValueOf<AbstractResourceFormInputs<T>>,
>({
  mapper,
  inputs,
  className,
  container = false,
}: {
  mapper: (
    input: [keyof NonNullable<Y>, NonNullable<ValueOf<NonNullable<Y>>>],
  ) => SynchronousReactNode;
  inputs: Y;
  className?: string;
  container?: boolean;
}) {
  if (inputs == null) {
    return null;
  }
  const mapped = typedEntries(inputs).map(([key, options]) =>
    options == null ? null : mapper([key, options]),
  );
  return container ? (
    <InputRow className={className}>{mapped}</InputRow>
  ) : (
    mapped
  );
}
