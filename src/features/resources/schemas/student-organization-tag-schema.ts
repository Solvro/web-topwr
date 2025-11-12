import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const StudentOrganizationTagSchema = z.object({
  tag: RequiredStringSchema,
});
