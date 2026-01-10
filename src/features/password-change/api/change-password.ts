import { fetchMutation } from "@/features/backend";
import type { MessageResponse } from "@/features/backend/types";

/**
 * Calls POST /api/v1/auth/change_password
 * Body: { oldPassword, newPassword, newPasswordConfirm }
 * Requires authentication; fetchMutation should attach tokens automatically
 */
export async function changePassword(body: {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  const response = await fetchMutation<MessageResponse>(
    "auth/change_password",
    {
      method: "POST",
      body,
    },
  );
  return response;
}
