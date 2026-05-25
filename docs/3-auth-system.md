# 3. Authentication System

We use **Auth.js (NextAuth v5 Beta)** for authentication, integrated directly into our Next.js App Router (`apps/web`).

## Current Strategy (MVP Phase)

- **Admin Only:** We currently only require authentication for the Dashboard (`/dashboard`). Storefront users (customers) do not require accounts yet (Guest Checkout).
- **Credentials Provider:** Authentication is done via email and password (Credentials login).
- **No OAuth Yet:** We are intentionally skipping Google, Facebook, and other social logins during the MVP phase to keep the system simple and secure.

## Implementation Details

### Configuration (`auth.ts`)
The configuration lives in `apps/web/auth.ts`. This exports the `auth`, `signIn`, and `signOut` functions, as well as Next.js route `handlers`.

### API Routes
Auth.js handles its own API routes inside `apps/web/app/api/auth/[...nextauth]/route.ts`.

### Middleware Protection
Dashboard routes are rigorously protected at the edge using Next.js Middleware (`apps/web/middleware.ts`).
- If a user tries to access `/dashboard/*` without a valid session, they are instantly redirected to `/auth/login`.

## Future Expansion
Once the Admin functionality is stable, we can expand Auth.js to include Customer accounts, incorporating OAuth or Magic Links as needed.
