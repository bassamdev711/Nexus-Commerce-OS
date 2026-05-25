import { Job } from "bullmq"
import { PrismaClient as DatabaseClient } from "@commerce-core/database"

const db = new DatabaseClient()

/**
 * Payment Worker Handler.
 * Processes payment webhook events that were enqueued by the ultra-thin webhook route.
 */
export async function handlePaymentJob(job: Job) {
  const { eventType, paymentIntentId, metadata } = job.data

  console.log(`💳 Processing payment event: ${eventType} for ${paymentIntentId}`)

  if (eventType === "payment_intent.succeeded") {
    // Check if already processed (DB-level idempotency)
    const existingPayment = await db.payment.findFirst({
      where: { providerPaymentId: paymentIntentId, status: "SUCCEEDED" }
    })

    if (existingPayment) {
      console.log(`⏭️ Payment ${paymentIntentId} already processed. Skipping.`)
      return
    }

    // Process the payment confirmation
    // In a full implementation, this would call the CheckoutService.confirmPayment()
    console.log(`✅ Payment ${paymentIntentId} confirmed by worker.`)
  }

  if (eventType === "payment_intent.payment_failed") {
    console.log(`⚠️ Payment ${paymentIntentId} failed. Initiating recovery flow.`)
    // Trigger inventory release, order status update, etc.
  }
}
