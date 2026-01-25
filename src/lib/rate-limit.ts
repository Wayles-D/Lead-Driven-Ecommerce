import { headers } from "next/headers";

/**
 * Basic in-memory rate limiter
 * Stores request counts in a Map with a TTL.
 */

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  identifier?: string;
}

const storage = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit helper for Server Actions
 */
export async function rateLimit({ limit, windowMs, identifier }: RateLimitConfig) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0] || "unknown";
  const key = `ratelimit_${identifier || "default"}_${ip}`;
  
  const now = Date.now();
  const data = storage.get(key);

  if (!data || now > data.resetAt) {
    // Start new window
    storage.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, count: 1, remaining: limit - 1 };
  }

  if (data.count >= limit) {
    return { 
      success: false, 
      error: "Too many requests. Please try again later.",
      resetAt: data.resetAt 
    };
  }

  data.count += 1;
  return { success: true, count: data.count, remaining: limit - data.count };
}
