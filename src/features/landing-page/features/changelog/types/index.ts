export interface ChangelogEntry {
  id: string | number;
  name: string;
  description: string | null;
  versionName: string;
  releaseDate: string;
}

export interface ChangelogVersion {
  name: string;
  entries: ChangelogEntry[];
}
