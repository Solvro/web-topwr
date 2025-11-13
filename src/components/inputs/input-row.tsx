import type { ReactNode } from "react";

import type { AbstractResourceFormInputs } from "@/features/abstract-resource-form/types";
import type { Resource } from "@/features/resources";
import { cn } from "@/lib/utils";
import type { WrapperProps } from "@/types/components";
import type { ValueOf } from "@/types/helpers";
import { typedEntries } from "@/utils";

type SynchronousReactNode = Exclude<ReactNode, Promise<ReactNode>>;

export function InputRow({
  children,
  className,
}: WrapperProps & {
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
