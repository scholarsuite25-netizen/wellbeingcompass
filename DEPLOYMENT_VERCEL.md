# Vercel Deployment — Env Checklist (Wellbeing Compass)

> **Never commit `.env`**. Only `.env.example` is tracked. All production values live in **Vercel Dashboard → Settings → Environment Variables**.

## 1. Required env vars (Production + Preview)

Copy from `.env.example` and set in Vercel Dashboard. Mark **Production** and **Preview** (or All).

| Var | Example | Notes |
|-----|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://wellbeingcompass.org` | Custom domain, or leave unset and Vercel auto-uses `VERCEL_URL` (`https://xxx.vercel.app`). Must include `https://`. |
| `NEXT_PUBLIC_SITE_NAME` | `Wellbeing Compass` | Display name |
| `DATABASE_URL` | `postgresql://postgres.xxx:PW@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | **Must be `postgresql://`**. Supabase → Project Settings → Database → Connection string → **URI** (pooler, port 6543). Local `file:./dev.db` will **fail** on Vercel (ephemeral FS) — `lib/env.ts` fails fast with a clear message. |
| `DIRECT_URL` | `postgresql://postgres.xxx:PW@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` | **Direct (non-pooler, port 5432)** connection used by Prisma for DDL (`prisma db push`). Pooler (pgbouncer) can't run DDL. |
| `NEXTAUTH_URL` | `https://wellbeingcompass.org` | Same as site URL. Vercel preview can auto-infer from `VERCEL_URL` if unset. |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | **32+ chars**, same for all envs. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NODE_ENV` | `production` | Set by Vercel automatically |

## 2. Optional (set when needed)

| Var | When |
|-----|------|
| `EMAIL_PROVIDER=console` (dev) / `resend` (prod) | `resend` requires `RESEND_API_KEY=re_...` + `EMAIL_FROM`, `CONTACT_TO_EMAIL` |
| `MEDIA_STORAGE_PROVIDER=vercel-blob` | **Durable uploads.** Requires `BLOB_READ_WRITE_TOKEN` (see § 2.1). Fallback value is `local` → uploads stored on the ephemeral instance FS and **lost on redeploy**. |
| `BLOB_READ_WRITE_TOKEN` | Auto-added by Vercel when you connect a Blob store (§ 2.1). Can also be pasted manually from Storage → Blob → Settings. |
| `ANALYTICS_PROVIDER=none`→`plausible`/`ga` | `plausible` needs `ANALYTICS_DOMAIN` |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | If using Supabase client/storage directly (not needed for Blob) |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Defaults 60000/60 |

## 2.1 Set up durable media uploads (Vercel Blob) — step by step

1. **Create a Blob store**
   - Vercel project → **Storage** tab → **Create Database/Store** → pick **Blob**.
   - Name it (e.g. `wellbeing-compass-blob`) and choose a region close to your users.
2. **Auto-provisioned env var**
   - Vercel adds **`BLOB_READ_WRITE_TOKEN`** to the project Environment Variables automatically (Settings → Environment Variables). Verify it exists and is marked for **Production** (and Preview if you want uploads to work there).
3. **Point the app at Blob**
   - Add **`MEDIA_STORAGE_PROVIDER=vercel-blob`** (Production + Preview).
   - That's the whole code path: `app/api/media/route.ts` → `lib/storage.ts` → `@vercel/blob`. No redeploy of code is needed, but a **redeploy is required** to bake the new env vars (Settings → Deployments → ⋯ → **Redeploy**, or push a commit).
4. **Verify**
   - `lib/env.ts` fails fast at build if `MEDIA_STORAGE_PROVIDER=vercel-blob` but `BLOB_READ_WRITE_TOKEN` is missing — a bad config will never silently ship.
   - After deploy, log into `/admin`, open the editor, upload an image. The editor shows **“Image uploaded to durable storage.”** and the stored URL is `https://<namespace>.public.blob.vercel-storage.com/uploads/img-…`, not `/uploads/…`.
5. **Rollback**
   - Delete `MEDIA_STORAGE_PROVIDER` (or set `local`) and redeploy — uploads fall back to the ephemeral folder.

**Why local is not enough:** on Vercel, `public/uploads` lives on an instance's ephemeral disk. Files vanish on every redeploy/cold start. Blob (or S3/R2/Supabase) is the permanent home for user-uploaded images.

## 3. Vercel build

`package.json:vercel-build` = `node scripts/prepare-prisma.js && prisma generate && prisma db push --accept-data-loss && next build`

- `scripts/prepare-prisma.js` **auto-switches** `prisma/schema.prisma` provider to `postgresql` when `DATABASE_URL` is `postgresql://`, or `sqlite` when it's `file:` — no manual provider editing is ever needed. The committed schema provider is therefore cosmetic (currently `sqlite` for local dev).
- `prisma db push --accept-data-loss` shapes the production database from the schema on every deploy. Committed `prisma/migrations/` files are **not** used in production (vestigial/local-only).
- `postinstall: prisma generate` ensures the client on install.
- Local dev stays `npm run dev` + `DATABASE_URL=file:./dev.db` + `npm run db:push`/`npm run db:seed`.

## 4. Seed the production database (once)

Deploys push the **schema**, not the rows. After the first successful deploy:

```
# from a machine with repo + Node (fills categories, founder, sample authors)
$env:DATABASE_URL="postgresql://<pooler:6543>"; $env:DIRECT_URL="postgresql://<direct:5432>"
npm run db:seed
```

Verify rows in Supabase **Table Editor** (`author`, `category`, `user`, `article`), or:
`https://<your-domain>/api/authors` (dynamic → reflects DB rows) should list the seeded authors.

## 5. Verify env on Vercel

After deploy, check:
- `https://xxx.vercel.app/api/auth/providers` shows the credentials provider (proves `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
- `/admin` editor dropdowns list seeded authors/categories (proves `db push` + seed worked).
- Upload an image in the editor → Blob URL returns (`durable: true`) once § 2.1 is configured.
- Build logs: `lib/env.ts` throws clear errors for a `file:` `DATABASE_URL` on Vercel, missing `NEXTAUTH_SECRET`, or Blob token missing while provider is `vercel-blob`.
- No secrets in logs or repo: `git ls-files` must not contain `.env`.

## 6. Common pitfalls

- **Quoted `DATABASE_URL`**: Vercel Dashboard strips quotes — set as `postgresql://...` **without** `"`.
- **Pooler vs direct**: `DATABASE_URL` = pooled (6543) for queries; `DIRECT_URL` = direct (5432) so `db push`/DDL succeeds.
- **`NEXTAUTH_URL` mismatch**: If you use a custom domain, `NEXTAUTH_URL` must match it exactly (including `https://`), or auth cookies fail. Leave it unset for previews to auto-infer.
- **Ephemeral uploads**: `MEDIA_STORAGE_PROVIDER=local` uploads are lost on redeploy — set Blob (or S3/R2) for production.
- **Stale sitemap**: `app/sitemap.ts` reads the DB at build time — CMS-created pages enter the sitemap on the next deploy (normal for Vercel).

## 7. Local vs Vercel quick reference

|  | Local (`npm run dev`) | Vercel (`vercel-build`) |
|---|---|---|
| DB | `DATABASE_URL=file:./dev.db`, provider auto → `sqlite` | `DATABASE_URL=postgresql://…(pooler)` + `DIRECT_URL` direct; provider auto → `postgresql` |
| Schema sync | `npm run db:push` / `db:seed` | `prisma db push --accept-data-loss` per build |
| Auth secret | `dev-secret-…` | Strong `openssl rand -base64 32` |
| Email | `console` (logs) | `resend` |
| Media | `local` (`/uploads`) | `vercel-blob` (durable) via `BLOB_READ_WRITE_TOKEN` |
| Analytics | `none` | `plausible` |

---

**Clean check:** `git check-ignore -v .env` → `.gitignore:4:.env`, `git ls-files | grep env` → only `.env.example`.