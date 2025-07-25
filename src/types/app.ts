import type { z } from "zod";

import type { ERROR_CODES } from "@/config/constants";
import type {
  DeclensionCase,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";

export interface StudentOrganization {
  id: number;
  name: string;
  departmentId: number | null;
  logoKey: string | null;
  coverKey: string | null;
  description: string | null;
  shortDescription: string | null;
  coverPreview: boolean;
  source: OrganizationSource;
  organizationType: OrganizationType;
  organizationStatus: OrganizationStatus;
  isStrategic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuideArticle {
  id: number;
  title: string;
  shortDesc: string;
  description: string;
  imageKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceTypes {
  [Resource.GuideArticles]: GuideArticle;
  [Resource.StudentOrganizations]: StudentOrganization;
}

export interface ListItem {
  id: number;
  name?: string;
  shortDescription?: string | null;
}

export type ErrorCode = keyof typeof ERROR_CODES;

export interface Pluralized<T> {
  singular: T;
  plural: T;
}
export type Declensions = Record<DeclensionCase, string>;

export type AppZodObject = z.ZodObject<z.ZodRawShape>;
