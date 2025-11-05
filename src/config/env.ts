import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const UrlBaseSchema = z
  .string()
  .url()
  .refine((value) => !value.endsWith("/"), {
    message: "URL must not end with a slash (/)",
  });
if (process.env.NODE_ENV === "test") {
  const { default: nextEnv } = await import("@next/env");
  nextEnv.loadEnvConfig(process.cwd());
}

export const env = createEnv({
  server: {
    TEST_USER_EMAIL: z.string().email().optional(),
    TEST_USER_PASSWORD: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_API_URL: UrlBaseSchema.refine(
      (value) => !value.includes("api/v"),
      { message: "NEXT_PUBLIC_API_URL must not include API version string" },
    ),
    NEXT_PUBLIC_WEBSITE_URL: UrlBaseSchema,
  },
  runtimeEnv: {
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
    /** The URL to the index path of the external API. */
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
