import { z } from "zod";

// Centralized env validation — single source of truth for all env usage
// See .env.example for documentation. Fails fast on missing/invalid vars in production.

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL required — e.g. file:./dev.db or postgresql://..."),
  NEXTAUTH_URL: z.string().url().optional(), // NextAuth infers in production, but we validate if set
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be >=32 chars — generate with: openssl rand -base64 32"),
  // Media storage
  MEDIA_STORAGE_PROVIDER: z.enum(["local", "s3", "r2"]).default("local"),
  MEDIA_STORAGE_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  // Email
  EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
  EMAIL_FROM: z.string().email().default("noreply@wellmind.health"),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  // Analytics (privacy-conscious)
  ANALYTICS_PROVIDER: z.enum(["none", "plausible", "ga"]).default("none"),
  ANALYTICS_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_DOMAIN: z.string().optional(),
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(60),
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("WellMind Health"),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

function validateEnv(): ServerEnv & ClientEnv {
  const raw: Record<string, string | undefined> = { ...process.env };

  // Allow DATABASE_URL with quotes (as written in .env: "file:./dev.db")
  if (raw.DATABASE_URL) raw.DATABASE_URL = raw.DATABASE_URL.replace(/^"|"$/g, "").replace(/^'/g, "").replace(/'$/g, "");

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

  if (errors.length > 0) {
    const msg = `❌ Invalid environment variables:\n${errors.join("\n")}\n\nSee .env.example and docs. In development, missing optional vars use safe defaults; required vars must be set.`;
    // In production, crash fast. In dev, log and continue with defaults where possible.
    if (raw.NODE_ENV === "production") throw new Error(msg);
    console.warn(msg);
    // Still return best-effort parsed (with defaults) so dev isn't blocked
    return {
      ...(serverParsed.success ? serverParsed.data : (serverSchema.parse({}) as ServerEnv)),
      ...(clientParsed.success ? clientParsed.data : (clientSchema.parse({}) as ClientEnv)),
      // overlay raw for any that did parse even if overall failed
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
