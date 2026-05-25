import Redis from "ioredis"

/**
 * Centralized Redis Connection.
 * Redis is the Distributed Runtime Backbone — NOT a source of truth.
 * PostgreSQL remains the absolute source of truth.
 */
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
})

redis.on("error", (err) => {
  console.error("[Redis] Connection error:", err.message)
})

redis.on("connect", () => {
  console.log("[Redis] Connected successfully.")
})

export default redis
