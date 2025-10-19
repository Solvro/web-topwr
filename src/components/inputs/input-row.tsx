import type { ReactNode } from "react";

import type { Resource } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { LayoutProps } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

type SynchronousReactNode = Exclude<ReactNode, Promise<ReactNode>>;

type AbstractResourceFormInput<T extends Resource> = Exclude<
  AbstractResourceFormInputs<T>[keyof AbstractResourceFormInputs<T>],
  undefined
>[number];

export function InputRow({
  children,
  className,
}: LayoutProps & {
  className?: string;
}) {
  return <div className={cn("flex flex-row gap-4", className)}>{children}</div>;
}

export function OptionalInputRow<
  Y extends AbstractResourceFormInput<T>,
  T extends Resource = Y extends AbstractResourceFormInput<infer U> ? U : never,
>({
  mapper,
  inputs,
  className,
}: {
  mapper: (input: Y) => SynchronousReactNode;
  inputs: Y[];
  className?: string;
}) {
  return inputs.length === 0 ? null : (
    <InputRow className={className}>
      {inputs.map((input) => mapper(input))}
    </InputRow>
  );
}
