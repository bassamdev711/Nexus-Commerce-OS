# 2. Database Design & Schema

Our database architecture focuses on financial accuracy, preventing data loss, and maintaining modularity. We use **Neon (PostgreSQL)** directly for development and production to eliminate local Docker overhead and environment mismatches.

## Core Principles

1. **Decimals over Floats:**
   - **Rule:** Never use `Float` for monetary values.
   - **Reason:** Floating-point math is imprecise and causes rounding errors.
   - **Solution:** We strictly use Prisma's `Decimal` type (`@db.Decimal(10, 2)`).

2. **Soft Deletes:**
   - **Rule:** Never physically delete records from core tables (Products, Orders, Categories).
   - **Solution:** We use a `deletedAt DateTime?` field. When a user "deletes" a product, we simply stamp `deletedAt`. Queries should always filter out records where `deletedAt != null`.

3. **Schema Splitting:**
   - We do not use a single massive `schema.prisma` file.
   - Using Prisma's `prismaSchemaFolder` preview feature, we split our schemas into domain-specific files inside `packages/database/prisma/schema/`:
     - `base.prisma` (Client generator and DB connection)
     - `store.prisma`
     - `product.prisma`
     - `cart.prisma`
     - `order.prisma`

## Important Tables

### Products and Variants
- Products support multiple variants (e.g. T-Shirt -> Red/XL, Blue/M).
- `ProductVariant` holds the exact `price`, `sku`, and `stock`.

### Carts (Guest & Session)
- **Rule:** Carts must be stored in the database, not just LocalStorage.
- We link Carts to users via a `sessionId` (for guests) or `customerId` (for logged-in users). This allows cart recovery across devices.

## Making Schema Changes

1. Edit the relevant `.prisma` file in `packages/database/prisma/schema/`.
2. Push to the database (development mode):
   ```bash
   pnpm --filter @commerce-core/database db:push
   ```
3. Generate the updated Prisma Client:
   ```bash
   pnpm --filter @commerce-core/database db:generate
   ```
