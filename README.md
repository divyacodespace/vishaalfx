# VishaalFX — Trading Course Enrollment Platform

A Next.js (App Router) + TypeScript + Tailwind CSS + PostgreSQL/Prisma application implementing the full
enrollment flow: age verification → student details (name, email, DOB, optional mobile) → Terms/Privacy/Risk
documents → combined consent → digital signature → signed PDF generation → admin-only review/approval →
gated course access.

**The Course fee is ₹50,000 (INR) — see `src/content/legal.ts` (`courseFee`). No in-app payment/checkout
flow is implemented; fee collection currently happens outside this codebase (e.g. bank transfer/offline),
and enrollment is approved by an admin after payment is confirmed manually. Building an in-app payment
flow is a separate, not-yet-started feature.**

## ⚠️ Before production launch

- All legal documents (`src/content/legal.ts`) are **draft templates** and must be reviewed by a qualified
  legal professional. They intentionally avoid claiming regulatory registration, DSC-grade signatures, or
  compliance with any specific data protection law.
- Business/legal placeholders (`.env` — `BUSINESS_*`, `ADMIN_*`) must be filled in with real, reviewed values.
- Email and mobile number are **not** independently verified (no OTP step) — they are taken as self-declared
  by the registrant. If you need verified contact info later, that's a deliberate feature to add back, not
  an oversight.
- Run `npm audit` and review before deploying; some transitive dependency advisories exist that should be
  triaged for your deployment target.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL via Prisma ORM
- JWT session cookies (separate secrets/cookies for students vs. admins)
- `pdf-lib` for server-side signed PDF generation
- Private, non-public file storage abstraction (local filesystem in dev; S3 interface stubbed for production)

## Project layout

```
src/
  app/                # Pages (landing, /join wizard, /legal/*, /dashboard, /admin/*) and API routes
  components/         # UI (ui/), landing page, enrollment wizard steps, admin, dashboard, legal
  content/            # Editable legal document text + default course module seed data
  lib/                # db, session/adminAuth, pdf/, storage, validation, config, audit, guards
prisma/
  schema.prisma       # Full data model (users, age verification, consent, signature, agreement, ...)
  seed.ts             # Seeds the first admin user + default course modules
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

| Variable | Where to add it |
|---|---|
| `DATABASE_URL` | Your [Supabase](https://supabase.com) PostgreSQL connection string — Project Settings → Database → Connection string → URI ("Direct connection", port 5432). Paste it in as-is; Prisma needs nothing else changed. |
| `STUDENT_SESSION_SECRET` / `ADMIN_SESSION_SECRET` | Generate with `openssl rand -hex 32` (two different values). |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` / `ADMIN_SEED_NAME` | Used once by `npm run seed` to create the first admin login. Change the password after first login. |
| `ADMIN_NOTIFICATION_EMAIL` | The verified mailbox that should be notified of new submissions (no PDF is ever emailed — see `src/lib/notify.ts`). |
| `STORAGE_DRIVER`, `S3_*` | Leave `STORAGE_DRIVER=local` for development (files land in `private-storage/`, which is gitignored and never served publicly). **For production on Vercel or any serverless host, you must set `STORAGE_DRIVER=s3`** — the local filesystem is ephemeral there. Fill in `S3_BUCKET`/`S3_REGION`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY` (works with AWS S3, or any S3-compatible provider via `S3_ENDPOINT` — Cloudflare R2, Backblaze B2, Supabase Storage, MinIO). The bucket must stay private (no public-read policy) — files are only ever served through the authenticated admin API routes. |
| `ESIGN_PROVIDER`, `ESIGN_API_KEY`, `ESIGN_API_SECRET` | Only needed if you integrate a compliant third-party e-sign provider in place of (or in addition to) the in-app drawn signature — see the note in `src/components/enroll/SignatureStep.tsx`. |
| `BUSINESS_*` | Legal entity name, address, support contact, jurisdiction. Do not launch with the placeholder values. |

### 3. Database

```bash
npx prisma migrate deploy    # applies the existing migration history to your Supabase DB
npm run seed                 # creates the first admin user + default course modules
```

### 4. Run

```bash
npm run dev
```

- Landing page: `http://localhost:3000`
- Enrollment flow: `http://localhost:3000/join`
- Student dashboard: `http://localhost:3000/dashboard`
- Admin login: `http://localhost:3000/admin/login` (credentials from `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`)

> **Note on this environment:** this workspace's only Node.js installation is 32-bit
> (`C:\Program Files (x86)\nodejs`), and Next.js's native SWC compiler does not have a working 32-bit
> Windows build here (`next build` / `next dev` crash with a DLL load failure — unrelated to this
> codebase). `npx tsc --noEmit` passes with zero errors, which is as far as this sandbox can verify.
> Install a 64-bit Node.js LTS (from nodejs.org) on the machine you actually develop/run this on, then
> `npm run dev` should work normally.

## How the flow is enforced

Every step of `/join` is gated **server-side**, not just hidden in the UI — see `src/lib/registrationGuard.ts`.
Each API route re-derives the caller's progress from the database before acting, so skipping steps by
calling APIs directly (or replaying old requests) is rejected with a 401/403.

Course access is only granted when **all** of the following are true (`src/app/api/admin/enrollments/[id]/approve/route.ts`):
18+ confirmed · student details complete (name, email, DOB) · Terms accepted · Privacy Policy accepted ·
Risk Disclosure accepted · final consent confirmed · signature captured · **and** an admin has approved.

## Security notes

- Admin passwords are bcrypt-hashed.
- The signed PDF and signature image are stored under `private-storage/` with random, unguessable filenames
  and are served only through authenticated, admin-authorized API routes (`/api/admin/enrollments/[id]/pdf`
  and `.../signature`) — never a public path.
- Session cookies are `httpOnly`, `sameSite=strict`, and `secure` in production; student and admin sessions
  use separate secrets/cookies.
- All mutating API routes validate input with `zod` and re-check authorization server-side.
- `src/lib/audit.ts` records an audit trail (age verification, details, consent, signature, submission,
  admin approve/reject/download) for compliance review.

## What's intentionally a stub

- `src/lib/notify.ts` — real transactional email for admin notifications (currently logs only)
- A production-grade e-sign provider integration, if a legally recognized (non-drawn) signature is required
