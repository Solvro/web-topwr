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
  name: z.string({ required_error: "Wymagane" }).trim().nonempty(),
  departmentId: z.number().int().positive().nullable().optional(),
  logoKey: z.string().nullable().optional(),
  coverKey: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  coverPreview: z.boolean({ required_error: "Wymagane" }),
  source: z.nativeEnum(OrganizationSource, { required_error: "Wymagane" }),
  organizationType: z.nativeEnum(OrganizationType, {
    required_error: "Wymagane",
  }),
  organizationStatus: z.nativeEnum(OrganizationStatus, {
    required_error: "Wymagane",
  }),
  isStrategic: z.boolean({ required_error: "Wymagane" }),
});

export const GuideArticleSchema = z.object({
  title: z.string({ required_error: "Wymagane" }).trim().nonempty(),
  imageKey: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});
