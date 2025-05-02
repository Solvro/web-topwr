export interface FileData {
  id: string;
  fileExtension: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface Organization {
  id: number;
  name: string;
  departmentId: number | null;
  logoKey: string | null;
  coverKey: string | null;
  description: string | null;
  shortDescription: string | null;
  coverPreview: boolean;
  source: string;
  organizationType: string;
  createdAt: string;
  updatedAt: string;
  organizationStatus: string;
}
