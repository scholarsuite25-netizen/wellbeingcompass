import { env } from "./env";

// Simple in-memory rate limiter (per-process). For multi-instance prod, swap to Redis/Upstash.
// Env: RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const max = env.RATE_LIMIT_MAX;
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now > cur.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }
  if (cur.count >= max) return { allowed: false, remaining: 0, resetAt: cur.resetAt };
  cur.count += 1;
  return { allowed: true, remaining: max - cur.count, resetAt: cur.resetAt };
}

export function getClientIp(req: Request): string {
  // Next headers: x-forwarded-for in prod behind proxy
  const h = (req.headers as any).get?.("x-forwarded-for") as string | null;
  if (h) return h.split(",")[0].trim();
  return "unknown";
}
