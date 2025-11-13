import { env } from "@/config/env";

export const getVersionedApiBase = (version = 1) =>
  `${env.NEXT_PUBLIC_API_URL}/api/v${String(version)}`;
