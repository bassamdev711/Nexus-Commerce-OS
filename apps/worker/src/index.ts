import { Worker, Job } from "bullmq"
import { redis } from "@commerce-core/infrastructure"
import { QUEUE_NAMES } from "@commerce-core/infrastructure"
import { handleNotificationJob } from "./handlers/notification.handler"
import { handlePaymentJob } from "./handlers/payment.handler"
import { handleReconciliationJob } from "./handlers/reconciliation.handler"

console.log("🚀 Commerce Worker Runtime Starting...")

/**
 * Notification Worker
 * Retries: 3, Exponential Backoff, DLQ after exhaustion
 */
const notificationWorker = new Worker(
  QUEUE_NAMES.NOTIFICATIONS,
  async (job: Job) => handleNotificationJob(job),
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000, // Max 10 notifications per second
    }
  }
)

/**
 * Payment Worker
 * Handles webhook-enqueued payment events.
 */
const paymentWorker = new Worker(
  QUEUE_NAMES.PAYMENTS,
  async (job: Job) => handlePaymentJob(job),
  {
    connection: redis,
    concurrency: 3, // Payments are sensitive, limit concurrency
  }
)

/**
 * Reconciliation Worker
 * Scheduled and on-demand stock reconciliation.
 */
const reconciliationWorker = new Worker(
  QUEUE_NAMES.RECONCILIATION,
  async (job: Job) => handleReconciliationJob(job),
  {
    connection: redis,
    concurrency: 1, // Reconciliation must be serial
  }
)

// --- DLQ Monitoring ---
for (const worker of [notificationWorker, paymentWorker, reconciliationWorker]) {
  worker.on("completed", (job) => {
    console.log(`✅ [${job.queueName}] Job ${job.name} completed.`)
  })

  worker.on("failed", (job, err) => {
    console.error(`❌ [${job?.queueName}] Job ${job?.name} failed after ${job?.attemptsMade} attempts:`, err.message)
    // If all attempts exhausted, this is effectively a DLQ entry.
    // In production, alert Sentry here.
  })
}

console.log("✅ All Workers registered and listening.")

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Graceful shutdown initiated...")
  await notificationWorker.close()
  await paymentWorker.close()
  await reconciliationWorker.close()
  process.exit(0)
})
