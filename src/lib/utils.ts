import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { FileData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getImageUrl = async (
  key: string | null,
): Promise<string | undefined> => {
  if (key == null) {
    return;
  }
  if (API_URL == null) {
    throw new Error("API_URL is not defined");
  }
  const response = await fetch(`${API_URL}api/v1/files/${key}`);
  if (!response.ok) {
    return;
  }

  const data = (await response.json()) as FileData;
  return data.url;
};
