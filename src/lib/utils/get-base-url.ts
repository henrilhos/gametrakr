export function getBaseUrl() {
  if (process.env.NODE_ENV === "production" && process.env.BASE_URL) {
    return `https://${process.env.BASE_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://${process.env.HOSTNAME ?? "localhost"}:${
    process.env.PORT ?? 3000
  }`;
}
