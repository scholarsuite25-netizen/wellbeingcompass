import { env } from "./env";

// Env-driven media storage abstraction — local | s3 | r2
// Local: store under /public/uploads (dev). S3/R2: presigned upload to bucket.

export type StorageProvider = typeof env.MEDIA_STORAGE_PROVIDER;

export function getStorageConfig() {
  return {
    provider: env.MEDIA_STORAGE_PROVIDER,
    bucket: env.MEDIA_STORAGE_BUCKET || env.AWS_S3_BUCKET || "wellbeing-compass-media",
    region: env.AWS_REGION || "us-east-1",
    hasCredentials: Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY),
  };
}

export function isS3Configured() {
  const c = getStorageConfig();
  return c.provider === "s3" && c.hasCredentials && Boolean(c.bucket);
}

export function publicMediaUrl(key: string) {
  const c = getStorageConfig();
  if (c.provider === "local") return `/uploads/${key}`;
  // S3/R2 public URL pattern — adjust for your CDN if using CloudFront/R2 public
  return `https://${c.bucket}.s3.${c.region}.amazonaws.com/${key}`;
}
