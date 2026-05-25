import { Queue } from "bullmq"
import { redis } from "../redis"

/**
 * Queue Name Registry.
 * Each queue has its own policies (retries, concurrency, backoff).
 * NEVER use a single queue for everything.
 */
export const QUEUE_NAMES = {
  NOTIFICATIONS: "notifications",
  PAYMENTS: "payments",
  RECONCILIATION: "reconciliation",
  FULFILLMENT: "fulfillment",
  ANALYTICS: "analytics",
} as const

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES]

const queues = new Map<string, Queue>()

export const queueFactory = {
  /**
   * Get or create a BullMQ Queue by name.
   * Queues are lazily initialized and cached.
   */
  getQueue(name: QueueName): Queue {
    if (!queues.has(name)) {
      queues.set(name, new Queue(name, {
        connection: redis,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000, // 2s, 4s, 8s
          },
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 5000 },
        }
      }))
    }
    return queues.get(name)!
  },

  /**
   * Enqueue a domain event into a specific queue.
   */
  async enqueue(queueName: QueueName, jobName: string, data: any, opts?: any) {
    const queue = this.getQueue(queueName)
    return queue.add(jobName, data, opts)
  }
}
