/**
 * Domain Events Registry.
 * Producers emit events → Queues route them → Workers handle them.
 * No spaghetti jobs.
 */

export const DOMAIN_EVENTS = {
  // --- Orders ---
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  ORDER_CANCELLED: "ORDER_CANCELLED",

  // --- Payments ---
  PAYMENT_SUCCEEDED: "PAYMENT_SUCCEEDED",
  PAYMENT_FAILED: "PAYMENT_FAILED",

  // --- Fulfillment ---
  FULFILLMENT_SHIPPED: "FULFILLMENT_SHIPPED",
  FULFILLMENT_DELIVERED: "FULFILLMENT_DELIVERED",
  FULFILLMENT_RETURNED: "FULFILLMENT_RETURNED",

  // --- Finance ---
  REFUND_ISSUED: "REFUND_ISSUED",

  // --- Inventory ---
  STOCK_LOW: "STOCK_LOW",
  STOCK_ADJUSTED: "STOCK_ADJUSTED",
  RESERVATION_EXPIRED: "RESERVATION_EXPIRED",
} as const

export type DomainEvent = typeof DOMAIN_EVENTS[keyof typeof DOMAIN_EVENTS]
