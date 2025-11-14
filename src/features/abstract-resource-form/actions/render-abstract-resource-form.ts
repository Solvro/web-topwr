"use server";

import type { ComponentProps } from "react";

import { AbstractResourceForm } from "../components/abstract-resource-form";

export async function renderAbstractResourceForm(
  props: ComponentProps<typeof AbstractResourceForm>,
) {
  return await AbstractResourceForm(props);
}
