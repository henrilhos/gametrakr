import { createConnection } from "node:net";
import { Redis } from "@upstash/redis";

type CacheOptions = { ex: number };

interface Cache {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, options: CacheOptions): Promise<void>;
}

type RedisResponse =
  | { complete: false }
  | { complete: true; value: string | null }
  | { complete: true; error: string };

class LocalRedisCache implements Cache {
  constructor(private readonly url: URL) {}

  async get<T>(key: string) {
    const value = await this.command(["GET", key]);
    return value === null ? null : (JSON.parse(value) as T);
  }

  async set(key: string, value: unknown, { ex }: CacheOptions) {
    await this.command(["SET", key, JSON.stringify(value), "EX", String(ex)]);
  }

  private command(parts: string[]) {
    return new Promise<string | null>((resolve, reject) => {
      const socket = createConnection({
        host: this.url.hostname,
        port: Number(this.url.port || 6379),
      });
      let response = "";

      socket.once("error", reject);
      socket.on("data", (chunk: Buffer) => {
        response += chunk.toString();
        const result = parseRedisResponse(response);
        if (!result.complete) return;

        socket.end();
        if ("error" in result) reject(new Error(result.error));
        else resolve(result.value);
      });
      socket.once("connect", () => socket.write(toRedisCommand(parts)));
    });
  }
}

const toRedisCommand = (parts: string[]) =>
  `*${parts.length}\r\n${parts.map((part) => `$${Buffer.byteLength(part)}\r\n${part}\r\n`).join("")}`;

const parseRedisResponse = (response: string): RedisResponse => {
  if (response.startsWith("+")) {
    return response.includes("\r\n")
      ? { complete: true, value: response.slice(1, -2) }
      : { complete: false };
  }

  if (response.startsWith("-")) {
    return response.includes("\r\n")
      ? { complete: true, error: response.slice(1, -2) }
      : { complete: false };
  }

  if (response === "$-1\r\n") return { complete: true, value: null };
  if (!response.startsWith("$")) return { complete: false };

  const [lengthLine] = response.split("\r\n", 1);
  const length = Number(lengthLine?.slice(1));
  const bodyStart = response.indexOf("\r\n") + 2;
  const bodyEnd = bodyStart + length;

  return response.length >= bodyEnd + 2
    ? { complete: true, value: response.slice(bodyStart, bodyEnd) }
    : { complete: false };
};

const upstashRedis = Redis.fromEnv();

const upstashCache: Cache = {
  async get<T>(key: string) {
    return (await upstashRedis.get<T>(key)) ?? null;
  },
  async set(key: string, value: unknown, options: CacheOptions) {
    await upstashRedis.set(key, value, options);
  },
};

export const cache: Cache =
  process.env.LOCAL_DEV === "true" || process.env.LOCAL_DEV === "1"
    ? new LocalRedisCache(
        new URL(process.env.LOCAL_REDIS_URL ?? "redis://localhost:6379"),
      )
    : upstashCache;
