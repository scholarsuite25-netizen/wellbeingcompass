# Vercel Deployment — Env Checklist (Wellbeing Compass)

> **Never commit `.env`**. Only `.env.example` is tracked. All production values live in **Vercel Dashboard → Settings → Environment Variables**.

## 1. Required env vars (Production + Preview)

Copy from `.env.example` and set in Vercel Dashboard. Mark **Production** and **Preview** (or All).

| Var | Example | Notes |
|-----|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://wellbeingcompass.org` | Custom domain, or leave unset and Vercel auto-uses `VERCEL_URL` (`https://xxx.vercel.app`). Must include `https://`. |
| `NEXT_PUBLIC_SITE_NAME` | `Wellbeing Compass` | Display name |
| `DATABASE_URL` | `postgresql://postgres.xxx:PW@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | **Must be `postgresql://`**. Supabase → Project Settings → Database → Connection string → **URI** (pooler, port 6543). Local `file:./dev.db` will **fail** on Vercel (ephemeral FS). |
| `NEXTAUTH_URL` | `https://wellbeingcompass.org` | Same as site URL. Vercel preview can auto-infer from `VERCEL_URL` if unset. |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | **32+ chars**, same for all envs. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NODE_ENV` | `production` | Set by Vercel automatically |

## 2. Optional (set when needed)

| Var | When |
|-----|------|
| `EMAIL_PROVIDER=console` (dev) / `resend` (prod) | `resend` requires `RESEND_API_KEY=re_...` + `EMAIL_FROM`, `CONTACT_TO_EMAIL` |
| `RESEND_API_KEY` | Resend → API Keys |
| `MEDIA_STORAGE_PROVIDER=local`→`s3` | `s3` requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` |
| `ANALYTICS_PROVIDER=none`→`plausible`/`ga` | `plausible` needs `ANALYTICS_DOMAIN` |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | If using Supabase client/storage directly |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Defaults 60000/60 |

## 3. Vercel build

`package.json:vercel-build` = `prisma generate && prisma migrate deploy && next build`
`vercel.json` sets `buildCommand: npm run vercel-build`.

- `postinstall: prisma generate` ensures client on install.
- `prisma migrate deploy` runs **migrations** (not `db push`) — requires committed `prisma/migrations/`. Do **not** use `file:./dev.db` in prod.
- Local dev stays `npm run dev` + `DATABASE_URL=file:./dev.db` + `prisma db push/seed`.

## 4. Prisma provider switch (critical)

Current `prisma/schema.prisma` `provider = "sqlite"` for local zero-config.

**Before first Vercel deploy:**
1. Change to `provider = "postgresql"` in `prisma/schema.prisma`
2. `npx prisma generate`
3. `npx prisma migrate dev --name init_postgres` (against Supabase) or `npx prisma db push` if no migrations
4. Commit migration to git
5. Deploy — Vercel will run `prisma migrate deploy`

Keep `provider = "sqlite"` locally if you want file DB; but you must swap to `postgresql` on branch that deploys to Vercel. See comments in `schema.prisma`.

## 5. Verify env on Vercel

After deploy, check:
- `https://xxx.vercel.app/api/newsletter` → `{"count":..., "provider":"resend"}` (if resend) proves `DATABASE_URL` works.
- `https://xxx.vercel.app/api/auth/providers` shows credentials provider.
- Build logs: `lib/env.ts` will throw if `NEXTAUTH_SECRET` <32 or `DATABASE_URL` is `file:` in `VERCEL_ENV=production`.
- No secrets in logs or repo: `git ls-files` must not contain `.env`.

## 6. Common pitfalls

- **Quoted DATABASE_URL**: Vercel Dashboard strips quotes — set as `postgresql://...` **without** `"` .
- **NEXTAUTH_URL mismatch**: If you set custom domain, `NEXTAUTH_URL` must match it exactly (including `https://`), else auth cookies fail.
- **Vercel preview**: Each preview gets unique `VERCEL_URL`; if `NEXTAUTH_URL` is hardcoded to prod, preview auth will break — leave `NEXTAUTH_URL` unset for previews to auto-infer.
- **Ephemeral FS**: Uploads to `local` are lost on Vercel — use `s3`/`r2` for prod.

## 7. Local vs Vercel quick reference

|  | Local (`npm run dev`) | Vercel (`vercel-build`) |
|---|---|---|
| DB | `DATABASE_URL=file:./dev.db` + `provider = "sqlite"` | `DATABASE_URL=postgresql://...` + `provider = "postgresql"` |
| Auth secret | `dev-secret-...` | Strong `openssl rand -base64 32` |
| Email | `console` (logs) | `resend` |
| Analytics | `none` | `plausible` |

---

**Clean check:** `git check-ignore -v .env` → `.gitignore:4:.env`, `git ls-files | grep env` → only `.env.example`.
