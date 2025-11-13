import { fetchMutation } from "@/features/backend";
import type {
  MessageResponse,
  SuccessResponse,
} from "@/features/backend/types";

export async function deleteAccessToken(
  accessToken: string,
  refreshToken: string,
) {
  await fetchMutation<SuccessResponse<MessageResponse>>("auth/logout", {
    accessTokenOverride: accessToken,
    body: { refreshToken },
  });
}
