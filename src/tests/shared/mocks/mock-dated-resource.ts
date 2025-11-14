import { faker } from "@faker-js/faker";

import type { DatedResource } from "@/features/backend/types";

export const mockDatedResource = (): DatedResource => ({
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
