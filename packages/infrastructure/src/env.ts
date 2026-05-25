import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  REDIS_URL: z.string().url("REDIS_URL must be a valid Redis URL"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters long"),
  MERCHANT_WHATSAPP_NUMBER: z.string().min(8, "Valid WhatsApp number is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error("❌ Invalid environment variables:")
  _env.error.issues.forEach(issue => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
  })
  process.exit(1)
}

export const env = _env.data
