"use client";

import { track as trackWithVercel } from "@vercel/analytics";

export const track = (...args: Parameters<typeof trackWithVercel>) => {
  if (process.env.NEXT_PUBLIC_LOCAL_DEV !== "true") trackWithVercel(...args);
};
