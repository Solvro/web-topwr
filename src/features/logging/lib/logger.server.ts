import pino from "pino";

import { env } from "@/config/env";

export const serverLogger = pino({
  level: env.NEXT_PUBLIC_LOG_LEVEL,
  base: null,
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});
