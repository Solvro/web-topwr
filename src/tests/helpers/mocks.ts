import { faker } from "@faker-js/faker";
import { HttpResponse } from "msw";
import type { JsonBodyType, StrictRequest } from "msw";

import type { Resource } from "@/config/enums";
import { env } from "@/config/env";
import type { DatedResource, FileEntry } from "@/types/api";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";

export const mockDatedResource = (): DatedResource => ({
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export function generateFileEntry(): FileEntry {
  const id = faker.string.uuid();
  const fileExtension = faker.helpers.arrayElement(["png", "jpg", "jpeg"]);
  return {
    ...mockDatedResource(),
    id,
    fileExtension,
    url: `${env.NEXT_PUBLIC_API_URL}/uploads/${id}.${fileExtension}`,
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
  const responseBody = { ...body, ...metadata } as ResourceDataType<T>;
  return HttpResponse.json(responseBody, { status: 201 });
}
