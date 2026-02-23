import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { UniversityBranch } from "../enums";

export const CampusSchema = z.object({
  name: RequiredStringSchema,
  coverKey: z.string().nullish(),
  branch: z.nativeEnum(UniversityBranch),
});
