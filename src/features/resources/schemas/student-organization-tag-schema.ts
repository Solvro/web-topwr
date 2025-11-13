import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const StudentOrganizationTagSchema = z.object({
  tag: RequiredStringSchema,
});
