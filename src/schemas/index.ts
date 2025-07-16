import { z } from "zod";

import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/enums";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export const StudentOrganizationSchema = z.object({
  name: z.string().min(1),
  departmentId: z.number().int().positive().nullable().optional(),
  //   logoKey: z.string().nullable().optional(),
  //   coverKey: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  coverPreview: z.boolean(),
  source: z.nativeEnum(OrganizationSource),
  organizationType: z.nativeEnum(OrganizationType),
  organizationStatus: z.nativeEnum(OrganizationStatus),
  isStrategic: z.boolean(),
});

export const GuideArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  //   imageKey: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});
