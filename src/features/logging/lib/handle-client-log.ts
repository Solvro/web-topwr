import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { MAX_LOG_PAYLOAD_LENGTH } from "../constants";
import { serverLogger } from "../lib/logger.server";
import { LogPayloadSchemaServer } from "../schemas/log-payload-schema.server";
import { parseError } from "../utils/parse-error";

/** Route handler for accepting client-side logs and logging them on the server. */
export async function handleClientLog(request: NextRequest) {
  try {
    const logEntry = (await request.json()) as unknown;
    const logPayload = LogPayloadSchemaServer.safeParse(logEntry);
    if (!logPayload.success) {
      serverLogger.warn(
        { errors: logPayload.error.errors, received: logEntry },
        "Invalid log payload received from client",
      );
      return NextResponse.json(
        { success: false, error: logPayload.error.format() },
        { status: 400 },
      );
    }
    const payloadLength = JSON.stringify(logPayload.data).length;
    if (payloadLength > MAX_LOG_PAYLOAD_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: "Log payload too large",
        },
        { status: 413 },
      );
    }

    const { level, message, ...rest } = logPayload.data;

    const enrichedLog = {
      ...rest,
      client: true,
    };

    serverLogger[level](enrichedLog, message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, ...parseError(error) },
      { status: 500 },
    );
  }
}
