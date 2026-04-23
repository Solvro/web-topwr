import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

export const ChangePasswordSchema = z
  .object({
    oldPassword: RequiredStringSchema,
    newPassword: RequiredStringSchema.min(8, {
      message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_MIN_LENGTH,
    })
      .regex(/[A-Z]/, {
        message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_REQUIRE_UPPER,
      })
      .regex(/[a-z]/, {
        message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_REQUIRE_LOWER,
      })
      .regex(/[0-9]/, {
        message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_REQUIRE_NUMBER,
      }),
    newPasswordConfirm: RequiredStringSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_PASSWORDS_MUST_MATCH,
    path: ["newPasswordConfirm"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: FORM_ERROR_MESSAGES.CHANGE_PASSWORD_MUST_DIFFER,
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
