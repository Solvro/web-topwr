import type { z } from "zod";

import type {
  GuideArticleSchema,
  LoginSchema,
  StudentOrganizationSchema,
} from "@/schemas";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type GuideArticleFormValues = z.infer<typeof GuideArticleSchema>;
export type StudentOrganizationFormValues = z.infer<
  typeof StudentOrganizationSchema
>;
