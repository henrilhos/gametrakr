import { env } from "~/env.mjs";

export const getBaseUrl = () => {
  if (env.NODE_ENV === "production" && process.env.BASE_URL)
    return `https://${process.env.BASE_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
