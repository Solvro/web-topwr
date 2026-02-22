import type { z } from "zod";

import type { SavedToastSchema } from "../schemas/saved-toast-schema";

export type SavedToast = z.infer<typeof SavedToastSchema>;
