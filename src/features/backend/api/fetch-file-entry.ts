import type { FileEntry } from "../types/responses";
import { fetchQuery } from "./fetch-query";

export const fetchFileEntry = async (imageKey: string) =>
  fetchQuery<FileEntry>(`/files/${imageKey}`);
