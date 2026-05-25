import { redis } from "../redis"

/**
 * Distributed Cache Service.
 * Caches read-heavy, immutable-ish data ONLY.
 * 
 * ✅ Cache: products, categories, storefront projections
 * ❌ Never cache: orders, payments, inventory truth
 * 
 * PostgreSQL remains the absolute Source of Truth.
 */
export const cacheService = {
  /**
   * Get a cached value. Returns null on miss.
   */
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(`cache:${key}`)
    if (!cached) return null
    try {
      return JSON.parse(cached) as T
    } catch {
      return null
    }
  },

  /**
   * Set a value with a TTL.
   * @param ttlSeconds Default 300 (5 minutes)
   */
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await redis.set(`cache:${key}`, JSON.stringify(value), "EX", ttlSeconds)
  },

  /**
   * Invalidate a specific cache key.
   */
  async invalidate(key: string): Promise<void> {
    await redis.del(`cache:${key}`)
  },

  /**
   * Invalidate all keys matching a pattern (e.g., "products:*").
   * Use sparingly — scan is O(N).
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const stream = redis.scanStream({ match: `cache:${pattern}`, count: 100 })
    const pipeline = redis.pipeline()
    
    for await (const keys of stream) {
      for (const key of keys as string[]) {
        pipeline.del(key)
      }
    }
    
    await pipeline.exec()
  }
}
