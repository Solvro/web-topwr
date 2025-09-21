import { fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

export const fetchFileEntry = async (imageKey: string) =>
  fetchQuery<FileEntry>(`/files/${imageKey}`);
