import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { serverLogger } from "../lib/logger.server";
import { LogPayloadSchemaServer } from "../schemas/log-payload-schema.server";

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
        { success: false, message: logPayload.error.format() },
        { status: 400 },
      );
    }

    const { level, message, ...rest } = logPayload.data;

    const ip = request.headers.get("x-forwarded-for");
    const enrichedLog = {
      ...rest,
      client: true,
      userAgent: request.headers.get("user-agent"),
      ip,
    };

    serverLogger[level](enrichedLog, message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
