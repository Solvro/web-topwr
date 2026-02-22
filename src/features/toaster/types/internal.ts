import type { z } from "zod";

import type { SavedToastSchema } from "../schemas/saved-toast-schema";
import type { ToastLevelSchema } from "../schemas/toast-level";

export type ToastLevel = z.infer<typeof ToastLevelSchema>;
export type SavedToast = z.infer<typeof SavedToastSchema>;
