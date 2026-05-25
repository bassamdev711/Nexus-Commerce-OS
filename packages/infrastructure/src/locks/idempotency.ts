import { redis } from "../redis"

/**
 * Distributed Idempotency Lock using Redis SET NX EX.
 * Protects critical financial operations from duplicate processing.
 * 
 * This is NOT a replacement for DB-level idempotency checks.
 * It is a high-speed first-line defense at the distributed layer.
 */
export const idempotencyLock = {
  /**
   * Attempt to acquire a lock for a given key.
   * Returns true if acquired (first caller wins), false if already locked.
   * @param key Unique lock key (e.g., "webhook:pi_xxx")
   * @param ttlSeconds Lock expiry time in seconds (default 300 = 5 min)
   */
  async acquire(key: string, ttlSeconds: number = 300): Promise<boolean> {
    const result = await redis.set(`lock:${key}`, "1", "EX", ttlSeconds, "NX")
    return result === "OK"
  },

  /**
   * Release a lock manually (e.g., after successful processing).
   */
  async release(key: string): Promise<void> {
    await redis.del(`lock:${key}`)
  },

  /**
   * Check if a lock is currently held (without acquiring it).
   */
  async isLocked(key: string): Promise<boolean> {
    const val = await redis.get(`lock:${key}`)
    return val !== null
  }
}
