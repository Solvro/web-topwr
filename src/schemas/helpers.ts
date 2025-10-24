import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";

export const RequiredStringSchema = z
  .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
  .trim()
  .min(1, { message: FORM_ERROR_MESSAGES.NONEMPTY });

const PositiveIntegerSchema = z
  .number()
  .int()
  .positive({ message: FORM_ERROR_MESSAGES.REQUIRED });

export const UnixTimestampSchema = PositiveIntegerSchema;
export const NumericIdSchema = PositiveIntegerSchema;

export const IsoTimestampSchema = z.string().datetime({ offset: true });

export const ColorValueSchema = z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/);
