import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production" && process.env.BASE_URL) {
    return `https://${process.env.BASE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const unixTimestampToYear = (unixTimestamp?: number | null) => {
  if (!unixTimestamp) return;

  const date = new Date(unixTimestamp * 1000); // JavaScript expects milliseconds, so multiply by 1000
  return date.getFullYear();
};

export const pluralize =
  (plural: string, singular: string) => (count: number) =>
    count === 1 ? singular : plural;
