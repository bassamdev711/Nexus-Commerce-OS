# 1. Architecture & Monorepo Setup

## Philosophy

Commerce Core is built on the principle of **Feature-Based Architecture** and **Domain Modules** rather than standard monolithic folders (`components/`, `hooks/`, `utils/`). This guarantees that the project can scale for years without becoming a "big ball of mud."

## Monorepo Strategy (pnpm + Turborepo)

We use `pnpm` workspaces for incredibly fast and space-efficient dependency management. `Turborepo` orchestrates our build pipeline, ensuring we only rebuild what has changed, utilizing intelligent caching.

### Packages (`/packages`)

To avoid over-engineering early on, we restrict shared packages to three core areas:

1. **`packages/ui`**: Contains our TailwindCSS configuration and all `shadcn/ui` primitive components. Everything is exported from `src/index.ts`. No business logic lives here.
2. **`packages/database`**: The single source of truth for our PostgreSQL schema and Prisma Client. We use Prisma's `prismaSchemaFolder` feature to split schemas by domain.
3. **`packages/commerce-core`**: Contains pure TypeScript domain logic (e.g., Services, Utilities, and complex rules). Think of it as an SDK for our eCommerce app.

### Applications (`/apps`)

1. **`apps/web`**: 
   - A single **Next.js 15 (App Router)** application.
   - We consciously combined the **Storefront** and **Dashboard** into one Next.js app to simplify Session management, Vercel deployments, and Prisma client sharing.
   - We will split them into separate Next.js apps *only* if the scale strictly demands it in the future.
   
   **Routing within `web`:**
   - `/` -> Storefront Pages (Wrapped in `(store)` route group)
   - `/dashboard` -> Admin Dashboard Pages (Protected by Auth middleware)

## Feature-Based Structure

Inside `apps/web`, instead of generic global folders, we group code by **Features**.

**Example:**
```txt
apps/web/
 ├── app/
 ├── features/
 │    ├── products/
 │    │    ├── actions.ts
 │    │    ├── components/
 │    │    └── validators.ts
 │    ├── cart/
 │    └── checkout/
```
This encapsulates logic right where it belongs, preventing spaghetti code.
