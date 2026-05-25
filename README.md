# Commerce OS - Enterprise E-Commerce Platform

[اللغة العربية](#نظرة-عامة-باللغة-العربية) | [English](#english-overview)

---

## English Overview

Commerce OS is an enterprise-grade e-commerce infrastructure designed for local and regional markets, prioritizing operational efficiency, scalable architecture, and streamlined customer acquisition via WhatsApp commerce.

### Architecture Highlights

- **Monorepo Structure**: Built with Turborepo, separating the core operational logic (`apps/web`), background workers (`apps/worker`), reusable UI (`packages/ui`), database schema (`packages/database`), and distributed infrastructure (`packages/infrastructure`).
- **Core Technologies**: Next.js (App Router), Prisma (PostgreSQL), Auth.js v5 (NextAuth), Tailwind CSS, Shadcn/UI.
- **Distributed Infrastructure**: 
  - **BullMQ & Redis**: Segregated domain queues (notifications, payments, reconciliation, fulfillment, analytics) for asynchronous processing with exponential backoff and Dead Letter Queues (DLQ).
  - **Redis Cache & Locks**: Distributed idempotency locks for critical financial operations and high-speed caching for product catalogs.
- **Security & Governance**: 
  - Strict Role-Based Access Control (RBAC) with defined roles (SUPER_ADMIN, OPERATIONS, WAREHOUSE, SUPPORT, ANALYST).
  - Immutable Audit Logs for all critical system mutations.
  - Next.js Middleware protecting operational routes.
- **WhatsApp Commerce Runtime**: Optimized for markets where traditional payment gateways present friction. Features a direct checkout-to-WhatsApp flow, capturing leads and generating structured order details for manual, high-touch fulfillment.

### Getting Started

1. **Environment Variables**: Copy `.env.example` to `.env` and configure your PostgreSQL database and Redis URLs. Ensure `ADMIN_PASSWORD` is set.
2. **Database Migration**: Run `pnpm db:push` to sync the Prisma schema.
3. **Seed Database**: Run `pnpm tsx apps/web/src/scripts/seed-admin.ts` to generate the initial Super Admin account.
4. **Run Development Server**: Execute `pnpm dev` to start the web application and background workers.

---

## نظرة عامة باللغة العربية

نظام Commerce OS هو بنية تحتية متطورة للتجارة الإلكترونية مصممة للأسواق المحلية والإقليمية، تعطي الأولوية للكفاءة التشغيلية، والبنية القابلة للتوسع، وتسهيل اكتساب العملاء عبر الشراء المباشر من خلال تطبيق واتساب.

### الميزات المعمارية

- **هيكلية Monorepo**: مبني باستخدام Turborepo، مما يفصل المنطق التشغيلي الأساسي (`apps/web`)، معالجات الخلفية (`apps/worker`)، واجهات المستخدم القابلة لإعادة الاستخدام (`packages/ui`)، قاعدة البيانات (`packages/database`)، والبنية التحتية الموزعة (`packages/infrastructure`).
- **التقنيات الأساسية**: Next.js (App Router)، Prisma (PostgreSQL)، Auth.js v5 (NextAuth)، Tailwind CSS، Shadcn/UI.
- **البنية التحتية الموزعة**:
  - **BullMQ & Redis**: طوابير مهام معزولة (الإشعارات، المدفوعات، المطابقات، الشحن، التحليلات) للمعالجة غير المتزامنة مع آليات إعادة المحاولة الذكية.
  - **Redis Cache & Locks**: أقفال موزعة (Idempotency Locks) لحماية العمليات المالية الحرجة، وتخزين مؤقت عالي السرعة لكتالوج المنتجات.
- **الأمان والحوكمة**:
  - نظام صارم للتحكم في الوصول المبني على الأدوار (RBAC) بأدوار محددة مسبقاً.
  - سجلات تدقيق (Audit Logs) غير قابلة للتعديل لجميع التغييرات الحساسة في النظام.
  - حماية المسارات التشغيلية عبر Next.js Middleware.
- **نظام تجارة واتساب (WhatsApp Commerce)**: مُحسّن للأسواق التي تواجه تحديات مع بوابات الدفع التقليدية. يتميز بمسار مباشر من صفحة الدفع إلى واتساب، مما يلتقط بيانات العميل ويولد تفاصيل طلب منظمة لتسهيل الإدارة والتنفيذ اليدوي.

### دليل التشغيل

1. **متغيرات البيئة**: انسخ ملف `.env.example` إلى `.env` وقم بإعداد روابط قاعدة بيانات PostgreSQL و Redis. تأكد من تعيين `ADMIN_PASSWORD`.
2. **قاعدة البيانات**: قم بتشغيل `pnpm db:push` لمزامنة الهيكلية مع قاعدة البيانات.
3. **تهيئة النظام**: قم بتشغيل `pnpm tsx apps/web/src/scripts/seed-admin.ts` لإنشاء حساب المدير العام (Super Admin) الأولي.
4. **تشغيل الخادم**: نفذ الأمر `pnpm dev` لبدء تشغيل تطبيق الويب ومعالجات الخلفية.
