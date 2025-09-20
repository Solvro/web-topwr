import { faker } from "@faker-js/faker";

import { API_FILES_URL } from "@/config/constants";
import type { DatedResource, FileEntry } from "@/types/api";

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
