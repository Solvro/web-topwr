import { faker } from "@faker-js/faker";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { createStore } from "jotai";
import { HttpResponse } from "msw";
import type { JsonBodyType, StrictRequest } from "msw";
import type { ReactNode } from "react";
import { expect } from "vitest";

import type { Resource } from "@/config/enums";
import type { DatedResource } from "@/types/api";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";

import { TestProviders } from "./test-providers";

interface RenderResultWithStore extends RenderResult {
  store: ReturnType<typeof createStore>;
}

export function getToaster() {
  const toaster = screen.getByRole("region", { name: "Notifications alt+T" });
  expect(toaster).toBeInTheDocument();
  return toaster;
}

export function renderWithProviders(
  component: ReactNode,
  renderToaster = true,
): RenderResultWithStore {
  const store = createStore();
  return {
    store,
    ...render(
      <TestProviders store={store} renderToaster={renderToaster}>
        {component}
      </TestProviders>,
    ),
  };
}

export async function mockResourceResponse<T extends Resource>(
  request: StrictRequest<ResourceFormValues<T>>,
): Promise<HttpResponse<JsonBodyType>> {
  const body = await request.json();
  const metadata: {
    id: string;
  } & DatedResource = {
    id: faker.number.int({ min: 5000, max: 10_000 }).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const responseBody: ResourceDataType<T> = { ...body, ...metadata };
  return HttpResponse.json(responseBody, { status: 201 });
}
