import { Job } from "bullmq"
import { PrismaClient as DatabaseClient } from "@commerce-core/database"

const db = new DatabaseClient()

/**
 * Notification Worker Handler.
 * Replaces the old Promise.allSettled fire-and-forget approach.
 * Now has proper retries, exponential backoff, and DLQ.
 */
export async function handleNotificationJob(job: Job) {
  const { notificationId, channel, recipient, template } = job.data

  console.log(`📨 Processing notification ${notificationId} (attempt ${job.attemptsMade + 1})...`)

  // Fetch notification to verify it hasn't already been sent
  const notification = await db.notification.findUnique({ where: { id: notificationId } })
  
  if (!notification || notification.status === "SENT") {
    console.log(`⏭️ Notification ${notificationId} already processed. Skipping.`)
    return // Idempotent exit
  }

  if (channel === "EMAIL") {
    // In production, replace with real provider (Resend, Postmark, etc.)
    console.log(`✉️  Sending email to ${recipient}: ${template.subject}`)
    await new Promise(r => setTimeout(r, 300)) // Simulate network
  }

  // Mark as sent
  await db.notification.update({
    where: { id: notificationId },
    data: {
      status: "SENT",
      sentAt: new Date(),
      metadata: { processedBy: "worker", jobId: job.id }
    }
  })
}
