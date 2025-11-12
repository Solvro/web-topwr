import { faker } from "@faker-js/faker";

import { env } from "@/config/env";
import type { FileEntry } from "@/types/api";

import { mockDatedResource } from "./mock-dated-resource";

export function generateFileEntry(): FileEntry {
  const id = faker.string.uuid();
  const fileExtension = faker.helpers.arrayElement(["png", "jpg", "jpeg"]);
  return {
    ...mockDatedResource(),
    id,
    fileExtension,
    url: `${env.NEXT_PUBLIC_API_URL}/uploads/${id}.${fileExtension}`,
    miniaturesUrl: `${env.NEXT_PUBLIC_API_URL}/uploads/miniatures/${id}.${fileExtension}`,
  };
}
