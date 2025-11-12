import { fetchMutation } from "@/lib/fetch-utils";
import type { MessageResponse, SuccessResponse } from "@/types/api";

export async function deleteAccessToken(
  accessToken: string,
  refreshToken: string,
) {
  await fetchMutation<SuccessResponse<MessageResponse>>("auth/logout", {
    accessTokenOverride: accessToken,
    body: { refreshToken },
  });
}
