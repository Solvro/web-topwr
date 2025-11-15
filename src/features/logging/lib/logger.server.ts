import pino from "pino";

import { env } from "@/config/env";

export const serverLogger = pino({
  level: env.NEXT_PUBLIC_LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});
