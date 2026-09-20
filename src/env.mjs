import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { z } from "zod";

const toggle = z
  .enum(["true", "false", "0", "1"])
  .transform((v) => v === "true" || v === "1");

config();

const localDev =
  process.env.LOCAL_DEV === "true" || process.env.LOCAL_DEV === "1";
const skipExternalServiceValidation =
  localDev || process.env.NODE_ENV === "test";

/** @param {string} placeholder @param {string} label */
const requiredCloudValue = (placeholder, label) =>
  z
    .string()
    .min(1)
    .refine(
      (value) => !value.includes(placeholder),
      `You forgot to change the default ${label}`,
    );

/** @param {string} placeholder @param {string} label */
const optionalInLocalDev = (placeholder, label) =>
  skipExternalServiceValidation
    ? z.string().optional()
    : requiredCloudValue(placeholder, label);

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    ANALYZE: toggle.default("false"),
    LOCAL_DEV: toggle.default("false"),
    LOCAL_REDIS_URL: z.string().url().default("redis://localhost:6379"),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_POSTGRESQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    RESEND_API_KEY: optionalInLocalDev("YOUR_RESEND_API_KEY_HERE", "API key"),
    RESEND_EMAIL: skipExternalServiceValidation
      ? z.string().optional()
      : requiredCloudValue("YOUR_RESEND_EMAIL_HERE", "email").pipe(
          z.string().email(),
        ),
    TWITCH_CLIENT_ID: requiredCloudValue(
      "YOUR_TWITCH_CLIENT_ID_HERE",
      "client ID",
    ),
    TWITCH_SECRET_ID: requiredCloudValue(
      "YOUR_TWITCH_SECRET_ID_HERE",
      "secret",
    ),
    UPLOADTHING_TOKEN: optionalInLocalDev(
      "YOUR_UPLOADTHING_TOKEN_HERE",
      "token",
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
    NEXT_PUBLIC_LOCAL_DEV: toggle.default("false"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    LOCAL_DEV: process.env.LOCAL_DEV,
    LOCAL_REDIS_URL: process.env.LOCAL_REDIS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL: process.env.RESEND_EMAIL,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_SECRET_ID: process.env.TWITCH_SECRET_ID,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_LOCAL_DEV: process.env.NEXT_PUBLIC_LOCAL_DEV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
