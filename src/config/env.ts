import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { LOG_LEVELS } from "@/features/logging/node";
import { tryParseNumber } from "@/utils";

const UrlBaseSchema = z
  .string()
  .url()
  .refine((value) => !value.endsWith("/"), {
    message: "URL must not end with a slash (/)",
  });

export const env = createEnv({
  server: {
    TEST_USER_EMAIL: z.string().email().optional(),
    TEST_USER_PASSWORD: z.string().optional(),
    MAX_LOG_PAYLOAD_LENGTH: z.number().default(1000),
  },
  client: {
    /** The URL to the index path of the external API. */
    NEXT_PUBLIC_API_URL: UrlBaseSchema.refine(
      (value) => !value.includes("api/v"),
      { message: "NEXT_PUBLIC_API_URL must not include API version string" },
    ),
    /**
     * Used for website metadata, like OpenGraph images or canonical URLs.
     * Defaults to http://localhost:3000 in development.
     */
    NEXT_PUBLIC_WEBSITE_URL: UrlBaseSchema,
    /**
     * Prevents the 'are you sure?' browser dialog from appearing when closing or refreshing the page.
     * Does not prevent the component dialog that appears when navigating within the app.
     * Useful when developing features related to the resource edit or creation pages.
     * Defaults to `true` in development, and `false` in production.
     */
    NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION: z.boolean().default(false),
    NEXT_PUBLIC_LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
  },
  runtimeEnv: {
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
    MAX_LOG_PAYLOAD_LENGTH: process.env.MAX_LOG_PAYLOAD_LENGTH,
    NEXT_PUBLIC_API_URL: tryParseNumber(process.env.NEXT_PUBLIC_API_URL),
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION:
      process.env.NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION === "true",
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
