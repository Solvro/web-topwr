import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  UniversityBranch,
} from "../enums";

export const StudentOrganizationSchema = z.object({
  name: RequiredStringSchema,
  departmentId: NumericIdSchema.nullish(),
  logoKey: z.string().nullish(),
  coverKey: z.string().nullish(),
  description: z.string().nullish(),
  shortDescription: z.string().nullish(),
  enName: z.string().nullish(),
  enDescription: z.string().nullish(),
  enShortDescription: z.string().nullish(),
  coverPreview: z.boolean({ required_error: FORM_ERROR_MESSAGES.REQUIRED }),
  source: z.nativeEnum(OrganizationSource, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  organizationType: z.nativeEnum(OrganizationType, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  organizationStatus: z.nativeEnum(OrganizationStatus, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  isStrategic: z.boolean(),
  branch: z.nativeEnum(UniversityBranch),
});
