import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";

export const requiredString = () =>
  z
    .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
    .trim()
    .min(1, { message: FORM_ERROR_MESSAGES.NONEMPTY });

const positiveInteger = () => z.number().int().positive();
export const timestampNumber = () => positiveInteger();
export const numericId = () => positiveInteger();

export const isoTimestamp = () => z.string().datetime({ offset: true });

export const colorField = () => z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/);
