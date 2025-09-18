import { faker } from "@faker-js/faker";

import { API_FILES_URL } from "@/config/constants";
import type { DatedResource, FileEntry } from "@/types/api";

export const mockDatedResource = (): DatedResource => ({
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export function generateFileEntry(): FileEntry {
  const entry = {
    id: faker.string.uuid(),
    ...mockDatedResource(),
    fileExtension: faker.helpers.arrayElement(["png", "jpg", "jpeg"]),
  };

  const url = `${API_FILES_URL}/${entry.id}.${entry.fileExtension}`;

  return { ...entry, url };
}
