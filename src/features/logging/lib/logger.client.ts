import pino, { stdTimeFunctions } from "pino";

import { env } from "@/config/env";

import { CONSOLE_METHODS } from "../data/console-methods";
import { LogPayloadSchemaClient } from "../schemas/log-payload-schema.client";
import { getLogLevel } from "../utils/get-log-level";
import { sendLogToServer } from "../utils/send-server-log";

/* eslint-disable no-console */

export const clientLogger = pino({
  level: env.NEXT_PUBLIC_LOG_LEVEL,
  timestamp: stdTimeFunctions.isoTime,
  browser: {
    write: (data) => {
      const result = LogPayloadSchemaClient.safeParse(data);
      if (!result.success) {
        const message = "invalid log payload";
        console.warn(message, result.error.format());
        sendLogToServer({
          level: "warn",
          message,
          issues: result.error.issues,
        });
        return;
      }
      const { level, msg, ...payload } = result.data;
      const levelName = getLogLevel(level);
      const consoleMethod = CONSOLE_METHODS[levelName];
      console[consoleMethod](msg, payload);
      sendLogToServer({
        level: levelName,
        message: msg ?? "<missing-log-message>",
        ...payload,
      });
    },
  },
});
