import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const ChangePasswordSchema = z
  .object({
    oldPassword: RequiredStringSchema,
    newPassword: RequiredStringSchema.min(8, {
      message: "Hasło musi mieć co najmniej 8 znaków",
    }),
    newPasswordConfirm: RequiredStringSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Hasła muszą być identyczne",
    path: ["newPasswordConfirm"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Nowe hasło musi się różnić od starego",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
