import { RequiredStringSchema } from "@/schemas";

export const StringDateSchema =
  RequiredStringSchema.regex(/^\d{4}-\d{2}-\d{2}$/);
