# 4. Development Workflow & Guidelines

Welcome to the development team! This guide ensures that anyone working on the Commerce Core project writes code that is maintainable, highly performant, and aligned with our structural philosophy.

## Running the Project

### Initial Setup
Ensure you have `pnpm` installed.
```bash
npm install -g pnpm
```

Install dependencies from the root:
```bash
pnpm install
```

### Database Synchronization
Ensure your `DATABASE_URL` is set in `packages/database/.env`. Then run:
```bash
pnpm --filter @commerce-core/database db:push
pnpm --filter @commerce-core/database db:generate
```

### Starting the Dev Server
```bash
pnpm dev
```
This leverages Turborepo to intelligently start the Next.js application on `http://localhost:3000`.

## Adding UI Components (shadcn/ui)

Since we are utilizing `shadcn/ui`, we add components directly into our Next.js application configuration, but they are aliased to be shared across the UI if necessary.

To add a new component (e.g., Button):
```bash
cd apps/web
npx shadcn@latest add button
```

## Adding New Features (Domain Modules)

When you are tasked with building a new feature (e.g., "Coupons"), **DO NOT** scatter the files across `components/`, `lib/`, and `hooks/`.

Instead, create a dedicated domain module inside `apps/web/features/`:

```txt
apps/web/features/coupons/
 ├── actions.ts       // Server Actions for mutation
 ├── queries.ts       // Data fetching logic
 ├── validators.ts    // Zod schemas for validation
 ├── components/      // Components strictly specific to Coupons
 └── services.ts      // Complex business logic
```

## Dashboard UX Standards

The admin dashboard is meant to be a professional-grade SaaS application, not just a simple CRUD list.
When building dashboard views, you **must** implement:
- **Optimistic Updates:** Use `useOptimistic` or React Query so the UI reacts instantly to changes (e.g., toggling a product status).
- **Filters & Search:** Use URL Search Params for filtering so that states are shareable and bookmarkable.
- **Bulk Actions:** Allow administrators to select multiple rows and perform actions efficiently.

By adhering strictly to these guidelines, we will maintain an enterprise-level Commerce Engine for years to come.
