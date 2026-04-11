import type { ReactNode } from "react";

import { InputRow } from "@/components/inputs/input-row";
import type { Resource } from "@/features/resources";
import type { ValueOf } from "@/types/helpers";
import { typedEntries } from "@/utils";

import type { AbstractResourceFormInputs } from "../types";

type SynchronousReactNode = Exclude<ReactNode, Promise<ReactNode>>;

type AbstractResourceFormInputSet<T extends Resource> = NonNullable<
  Exclude<
    ValueOf<AbstractResourceFormInputs<T>>,
    AbstractResourceFormInputs<T>[]
  >
>;

/** Renders all input components of a given type (e.g. text inputs). */
export function ArfInputSet<
  T extends Resource,
  Y extends AbstractResourceFormInputSet<T>,
>({
  mapper,
  inputs,
  className,
  container = false,
}: {
  mapper: (input: [keyof Y, NonNullable<Y[keyof Y]>]) => SynchronousReactNode;
  inputs?: Y | null;
  className?: string;
  container?: boolean;
}) {
  if (inputs == null) {
    return null;
  }

  const mapped = typedEntries(inputs).map(([key, options]) => {
    if (options == null) {
      return null;
    }
    return mapper([key, options as NonNullable<Y[keyof Y]>]);
  });

  return container ? (
    <InputRow className={className}>{mapped}</InputRow>
  ) : (
    mapped
  );
}
