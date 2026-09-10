import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { isPhoneNumber } from "@/utils";

import { RequiredStringSchema } from "./required-string-schema";

const ALLOWED_PROTOCOLS = [
  "https:",
  "http:",
  "mailto:",
  "tel:",
  "topwr:",
] as const;

const isEmail = (value: string): boolean =>
  z.string().email().safeParse(value).success;

const isProtocolUrl = (value: string): boolean =>
  z.string().url().safeParse(value).success &&
  ALLOWED_PROTOCOLS.some((protocol) => value.startsWith(protocol));

export const RequiredLinkSchema = RequiredStringSchema.refine(
  (value) => isProtocolUrl(value) || isEmail(value) || isPhoneNumber(value),
  {
    message: FORM_ERROR_MESSAGES.INVALID_URL,
  },
);
