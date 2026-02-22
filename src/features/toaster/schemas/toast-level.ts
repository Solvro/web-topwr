import { z } from "zod";

export const ToastLevelSchema = z.enum(["info", "success", "error", "warning"]);
