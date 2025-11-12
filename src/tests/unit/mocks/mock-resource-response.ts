import { faker } from "@faker-js/faker";
import { HttpResponse } from "msw";
import type { JsonBodyType, StrictRequest } from "msw";

import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceFormValues,
} from "@/features/resources/types";
import type { DatedResource } from "@/types/api";

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
  const responseBody = { ...body, ...metadata } as ResourceDataType<T>;
  return HttpResponse.json(responseBody, { status: 201 });
}
