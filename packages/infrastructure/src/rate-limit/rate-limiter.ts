import { redis } from "../redis"

/**
 * Distributed Rate Limiter using Redis.
 * Sliding window counter algorithm.
 * 
 * Protects critical attack surfaces:
 * - /portal/login (brute force)
 * - /checkout (abuse)
 * - /api/webhooks/stripe (flood)
 */
export const rateLimiter = {
  /**
   * Check if a request is allowed under the rate limit.
   * @param identifier Unique identifier (e.g., IP address, user ID)
   * @param endpoint Route name for policy lookup
   * @param maxRequests Maximum requests allowed in the window
   * @param windowSeconds Time window in seconds
   * @returns true if allowed, false if rate limited
   */
  async isAllowed(
    identifier: string, 
    endpoint: string, 
    maxRequests: number, 
    windowSeconds: number
  ): Promise<boolean> {
    const key = `ratelimit:${endpoint}:${identifier}`
    const now = Date.now()
    const windowStart = now - (windowSeconds * 1000)

    // Sliding window using sorted sets
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(key, 0, windowStart) // Remove expired entries
    pipeline.zadd(key, now, `${now}`)              // Add current request
    pipeline.zcard(key)                             // Count requests in window
    pipeline.expire(key, windowSeconds)             // Auto-cleanup

    const results = await pipeline.exec()
    const requestCount = results?.[2]?.[1] as number || 0

    return requestCount <= maxRequests
  },

  /**
   * Get remaining requests for an identifier.
   */
  async remaining(
    identifier: string, 
    endpoint: string, 
    maxRequests: number, 
    windowSeconds: number
  ): Promise<number> {
    const key = `ratelimit:${endpoint}:${identifier}`
    const windowStart = Date.now() - (windowSeconds * 1000)

    await redis.zremrangebyscore(key, 0, windowStart)
    const count = await redis.zcard(key)
    
    return Math.max(0, maxRequests - count)
  }
}
