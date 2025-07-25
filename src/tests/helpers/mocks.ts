import { faker } from "@faker-js/faker";
import { HttpResponse } from "msw";
import type { JsonBodyType, StrictRequest } from "msw";

import { API_FILES_URL } from "@/config/constants";
import type { Resource } from "@/config/enums";
import type { DatedResource, FileEntry } from "@/types/api";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";

import { MOCK_API_RESOURCE_OPERATION } from "../mocks/functions";

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
    url: `${API_FILES_URL}/${id}.${fileExtension}`,
  };
}

export async function mockResourceResponse<T extends Resource>(
  resource: T,
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
  MOCK_API_RESOURCE_OPERATION({ operation: "create", resource, body });
  return HttpResponse.json(responseBody, { status: 201 });
}
