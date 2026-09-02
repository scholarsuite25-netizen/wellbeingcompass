import { z } from "zod";

// Centralized env validation — single source of truth for all env usage
// See .env.example for documentation. Fails fast on missing/invalid vars in production.

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL required — e.g. file:./dev.db or postgresql://..."),
  NEXTAUTH_URL: z.string().url().optional(), // Vercel: falls back to VERCEL_URL if not set — see validateEnv
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be >=32 chars — generate with: openssl rand -base64 32"),
  VERCEL_URL: z.string().optional(), // Provided by Vercel: e.g. wellbeing-xxxx.vercel.app
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL: z.string().optional(), // "1" on Vercel
  // Media storage
  MEDIA_STORAGE_PROVIDER: z.enum(["local", "s3", "r2"]).default("local"),
  MEDIA_STORAGE_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  // Email
  EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
  EMAIL_FROM: z.string().email().default("noreply@wellbeingcompass.org"),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  // Analytics (privacy-conscious)
  ANALYTICS_PROVIDER: z.enum(["none", "plausible", "ga"]).default("none"),
  ANALYTICS_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_DOMAIN: z.string().optional(),
  // Supabase (optional if using Supabase client/storage)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(60),
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Wellbeing Compass"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

function validateEnv(): ServerEnv & ClientEnv {
  const raw: Record<string, string | undefined> = { ...process.env };

  // Allow DATABASE_URL with quotes (as written in .env: "file:./dev.db")
  if (raw.DATABASE_URL) raw.DATABASE_URL = raw.DATABASE_URL.replace(/^"|"$/g, "").replace(/^'/g, "").replace(/'$/g, "");

  // Vercel: infer NEXTAUTH_URL / NEXT_PUBLIC_SITE_URL from VERCEL_URL if not explicitly set
  // Vercel provides VERCEL_URL without protocol (e.g. my-app.vercel.app)
  if (!raw.NEXTAUTH_URL && raw.VERCEL_URL) raw.NEXTAUTH_URL = `https://${raw.VERCEL_URL}`;
  if (!raw.NEXT_PUBLIC_SITE_URL && raw.VERCEL_URL) raw.NEXT_PUBLIC_SITE_URL = `https://${raw.VERCEL_URL}`;
  if (!raw.NEXT_PUBLIC_SITE_URL && raw.NEXTAUTH_URL) raw.NEXT_PUBLIC_SITE_URL = raw.NEXTAUTH_URL;

  const serverParsed = serverSchema.safeParse(raw);
  const clientParsed = clientSchema.safeParse(raw);

  const errors: string[] = [];
  if (!serverParsed.success) {
    errors.push(...serverParsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`));
  }
  if (!clientParsed.success) {
    errors.push(...clientParsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`));
  }

  // Cross-field: if EMAIL_PROVIDER=resend then RESEND_API_KEY required (except in test)
  if (raw.EMAIL_PROVIDER === "resend" && !raw.RESEND_API_KEY && raw.NODE_ENV !== "test") {
    errors.push("  • RESEND_API_KEY: required when EMAIL_PROVIDER=resend");
  }
  if (raw.MEDIA_STORAGE_PROVIDER === "s3" && (!raw.AWS_ACCESS_KEY_ID || !raw.AWS_SECRET_ACCESS_KEY) && raw.NODE_ENV === "production") {
    errors.push("  • AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY: required when MEDIA_STORAGE_PROVIDER=s3 in production");
  }
  // Vercel: DATABASE_URL must be postgresql (sqlite file: won't persist on ephemeral FS)
  if ((raw.VERCEL_ENV === "production" || raw.VERCEL === "1") && raw.DATABASE_URL?.startsWith("file:")) {
    errors.push("  • DATABASE_URL: Vercel production requires postgresql:// (Supabase/Neon) — file:./dev.db only for local dev. Set DATABASE_URL in Vercel Dashboard to your Supabase pooler URL and change prisma/schema.prisma provider to \"postgresql\" before deploy.");
  }
  if (raw.NODE_ENV === "production" && !raw.NEXTAUTH_SECRET) {
    errors.push("  • NEXTAUTH_SECRET: required in production — set in Vercel Dashboard (32+ chars)");
  }

  if (errors.length > 0) {
    const msg = `❌ Invalid environment variables:\n${errors.join("\n")}\n\nSee .env.example and docs. In development, missing optional vars use safe defaults; required vars must be set.`;
    // In production, crash fast. In dev, log and continue with safe defaults
    if (raw.NODE_ENV === "production") throw new Error(msg);
    console.warn(msg);
    const devDefaults: Partial<ServerEnv & ClientEnv> = {
      DATABASE_URL: raw.DATABASE_URL || "file:./dev.db",
      NEXTAUTH_SECRET: raw.NEXTAUTH_SECRET || "dev-secret-change-in-production-32chars-min-123456",
      NEXTAUTH_URL: raw.NEXTAUTH_URL || raw.VERCEL_URL ? `https://${raw.VERCEL_URL}` : "http://localhost:3000",
      NEXT_PUBLIC_SITE_URL: raw.NEXT_PUBLIC_SITE_URL || raw.NEXTAUTH_URL || (raw.VERCEL_URL ? `https://${raw.VERCEL_URL}` : "http://localhost:3000"),
      NEXT_PUBLIC_SITE_NAME: raw.NEXT_PUBLIC_SITE_NAME || "Wellbeing Compass",
    };
    return {
      ...(serverParsed.success ? serverParsed.data : {} as ServerEnv),
      ...(clientParsed.success ? clientParsed.data : {} as ClientEnv),
      ...devDefaults,
      ...raw,
    } as ServerEnv & ClientEnv;
  }

  return { ...serverParsed.data!, ...clientParsed.data! } as ServerEnv & ClientEnv;
}

// Singleton — validated once at import
export const env = validateEnv();

// Typed helpers
export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";

// Convenience for server/client separation (Next.js will tree-shake server-only)
export const serverEnv = env as ServerEnv;
export const clientEnv = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: env.NEXT_PUBLIC_SITE_NAME,
} as ClientEnv;
