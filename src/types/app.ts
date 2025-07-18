import type { ERROR_CODES } from "@/config/constants";
import type {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  ResourcePaths,
} from "@/lib/enums";

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

export interface Department {
  id: number;
  name: string;
}

export interface ResourceTypes {
  [ResourcePaths.GuideArticles]: GuideArticle;
  [ResourcePaths.StudentOrganizations]: StudentOrganization;
}

export type Resource = keyof ResourceTypes;

export interface ListItem {
  id: number;
  name?: string;
  shortDescription?: string | null;
}

export type ErrorCode = keyof typeof ERROR_CODES;
