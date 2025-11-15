import type { z } from "zod";

import type { LOG_LEVELS } from "../node";
import type { LogPayloadSchemaServer } from "../schemas/log-payload-schema.server";

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogObject {
  level: number;
  time: number;
  msg: string;
}

export type LogPayloadServer = z.infer<typeof LogPayloadSchemaServer>;
