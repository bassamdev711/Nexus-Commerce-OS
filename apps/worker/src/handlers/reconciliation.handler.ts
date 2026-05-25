import { Job } from "bullmq"
import { PrismaClient as DatabaseClient } from "@commerce-core/database"

const db = new DatabaseClient()

/**
 * Reconciliation Worker Handler.
 * Runs serially (concurrency=1) to prevent race conditions.
 */
export async function handleReconciliationJob(job: Job) {
  console.log(`🔄 Running stock reconciliation (attempt ${job.attemptsMade + 1})...`)

  // Find expired reservations
  const expiredOrders = await db.order.findMany({
    where: {
      status: "PENDING",
      reservationExpiresAt: { lt: new Date() }
    },
    include: { items: true }
  })

  if (expiredOrders.length === 0) {
    console.log("✅ No expired reservations found.")
    return
  }

  console.log(`🔍 Found ${expiredOrders.length} expired reservations. Releasing stock...`)

  for (const order of expiredOrders) {
    await db.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            reserved_stock: { decrement: item.quantity }
          }
        })
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" }
      })
    })

    console.log(`🧹 Released stock for expired order ${order.order_number}`)
  }

  console.log(`✅ Reconciliation complete. ${expiredOrders.length} orders cleaned up.`)
}
