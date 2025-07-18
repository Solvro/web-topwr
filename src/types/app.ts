import type { ERROR_CODES } from "@/config/constants";
import type {
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

export interface Department {
  id: number;
  name: string;
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
