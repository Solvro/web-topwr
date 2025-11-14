import { http, passthrough } from "msw";

import { getVersionedApiBase } from "@/features/backend/node";
import { server } from "@/tests/unit";

export function bypassMockServer(endpoint: string) {
  server.use(
    http.post(`${getVersionedApiBase()}/${endpoint}`, () => passthrough()),
  );
}
