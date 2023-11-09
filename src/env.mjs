import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const toggle = z
  .enum(["true", "false", "0", "1"])
  .transform((v) => v === "true" || v === "1");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    ANALYZE: toggle.default("false"),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_POSTGRESQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    RESEND_API_KEY: z
      .string()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_RESEND_API_KEY_HERE"),
        "You forgot to change the default API key",
      ),
    RESEND_EMAIL: z
      .string()
      .email()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_RESEND_EMAIL_HERE"),
        "You forgot to change the default email",
      ),
    TWITCH_CLIENT_ID: z
      .string()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_TWITCH_CLIENT_ID_HERE"),
        "You forgot to change the default client ID",
      ),
    TWITCH_SECRET_ID: z
      .string()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_TWITCH_SECRET_ID_HERE"),
        "You forgot to change the default secret ID",
      ),
    UPLOADTHING_SECRET: z
      .string()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_UPLOADTHING_SECRET_HERE"),
        "You forgot to change the default secret",
      ),
    UPLOADTHING_APP_ID: z
      .string()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_UPLOADTHING_APP_ID_HERE"),
        "You forgot to change the default app ID",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL: process.env.RESEND_EMAIL,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_SECRET_ID: process.env.TWITCH_SECRET_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
