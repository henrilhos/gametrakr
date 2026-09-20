import { Redis } from "@upstash/redis";
import z from "zod";

const redis = Redis.fromEnv();

const metadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
});

export const getMetadata = async (url: string) => {
  let cached = await redis.get<z.infer<typeof metadataSchema> | null>(url);

  if (!cached) {
    try {
      const res = await fetch(`https://api.dub.co/metatags?url=${url}`);
      const data = metadataSchema.parse(await res.json());

      await redis.set(url, data, {
        ex: 60 * 60,
      });
      cached = data;

      return data;
    } catch {
      await redis.set(url, null, {
        ex: 60 * 60,
      });
      return null;
    }
  }

  return cached;
};
