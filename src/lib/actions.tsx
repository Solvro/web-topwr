"use server";

import type { ComponentProps } from "react";

import { AbstractResourceForm } from "@/components/abstract/resource-form";

// actions require async functions, since they are an abstraction over an API endpoint
// eslint-disable-next-line @typescript-eslint/require-await
export async function renderAbstractResourceForm(
  props: ComponentProps<typeof AbstractResourceForm>,
) {
  return <AbstractResourceForm {...props} />;
}
