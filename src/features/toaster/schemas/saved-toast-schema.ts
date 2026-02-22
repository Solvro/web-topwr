import { z } from "zod";

import { ToastLevelSchema } from "./toast-level";

export const SavedToastSchema = z.object({
  level: ToastLevelSchema,
  message: z.string(),
});
