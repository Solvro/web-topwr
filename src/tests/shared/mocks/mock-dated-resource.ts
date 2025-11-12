import { faker } from "@faker-js/faker";

import type { DatedResource } from "@/types/api";

export const mockDatedResource = (): DatedResource => ({
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
