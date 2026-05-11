import { fetchMutation } from "@/features/backend";
import type { MessageResponse } from "@/features/backend/types";

export async function changePassword({
  oldPassword,
  newPassword,
  newPasswordConfirm,
}: {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}): Promise<MessageResponse> {
  const response = await fetchMutation<MessageResponse>(
    "auth/change_password",
    {
      method: "POST",
      body: {
        oldPassword,
        newPassword,
        newPasswordConfirm,
      },
    },
  );
  return response;
}
