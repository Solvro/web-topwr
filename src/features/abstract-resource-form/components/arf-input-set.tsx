import type { ReactNode } from "react";

import { InputRow } from "@/components/inputs/input-row";
import type { Resource } from "@/features/resources";
import type { ValueOf } from "@/types/helpers";
import { typedEntries } from "@/utils";

import type { AbstractResourceFormInputs } from "../types";

type SynchronousReactNode = Exclude<ReactNode, Promise<ReactNode>>;

/** Renders all input components of a given type (e.g. text inputs). */
export function ArfInputSet<
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

  const mapped = typedEntries(inputs as Record<string, unknown>).map(
    ([key, options]) => {
      if (options == null) {
        return null;
      }
      return mapper([
        key as keyof NonNullable<Y>,
        options as NonNullable<ValueOf<NonNullable<Y>>>,
      ]);
    },
  );

  return container ? (
    <InputRow className={className}>{mapped}</InputRow>
  ) : (
    mapped
  );
}
