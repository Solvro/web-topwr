import { z } from "zod";

import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/types";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const StudentOrganizationSchema = z.object({
  name: z.string().min(1),
  //   departmentId: z.number().int().positive().nullable(),
  //   logoKey: z.string().nullable(),
  //   coverKey: z.string().nullable(),
  description: z.string().nullable(),
  shortDescription: z.string().nullable(),
  coverPreview: z.boolean(),
  source: z.nativeEnum(OrganizationSource),
  organizationType: z.nativeEnum(OrganizationType),
  organizationStatus: z.nativeEnum(OrganizationStatus),
});
