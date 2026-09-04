import { env } from "./env";
import { put } from "@vercel/blob";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Env-driven media storage abstraction — local | s3 | r2 | supabase | vercel-blob
// Local: store under /public/uploads (dev, ephemeral on Vercel).
// Vercel Blob: durable object storage for Vercel deploys (production).

export type StorageProvider = typeof env.MEDIA_STORAGE_PROVIDER;

export function getStorageConfig() {
  return {
    provider: env.MEDIA_STORAGE_PROVIDER,
    bucket: env.MEDIA_STORAGE_BUCKET || env.AWS_S3_BUCKET || "wellbeing-compass-media",
    region: env.AWS_REGION || "us-east-1",
    hasCredentials: Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY),
    hasBlobToken: Boolean(env.BLOB_READ_WRITE_TOKEN),
  };
}

export function isBlobConfigured() {
  const c = getStorageConfig();
  return c.provider === "vercel-blob" && c.hasBlobToken;
}

export function isS3Configured() {
  const c = getStorageConfig();
  return c.provider === "s3" && c.hasCredentials && Boolean(c.bucket);
}

export interface StoredImage {
  url: string;
  storageProvider: string;
  durable: boolean;
}

// Persist an image buffer. Uses Vercel Blob when configured (durable),
// otherwise falls back to the local /public/uploads folder (dev, ephemeral).
export async function storeImage(opts: { buffer: Buffer; mime: string; ext: string; filename: string }): Promise<StoredImage> {
  const { buffer, mime, filename } = opts;

  if (isBlobConfigured()) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
    });
    return { url: blob.url, storageProvider: "vercel-blob", durable: true };
  }

  const dir = join(process.cwd(), "public", "uploads");
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, filename), buffer);
  } catch {
    throw new Error("Could not persist image on this host");
  }
  return { url: `/uploads/${filename}`, storageProvider: "local", durable: false };
}

export function publicMediaUrl(key: string) {
  const c = getStorageConfig();
  if (c.provider === "local") return `/uploads/${key}`;
  if (c.provider === "supabase") {
    const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
    return `${baseUrl}/storage/v1/object/public/${c.bucket}/${key}`;
  }
  if (c.provider === "vercel-blob") return key;
  // S3/R2 public URL pattern — adjust for your CDN if using CloudFront/R2 public
  return `https://${c.bucket}.s3.${c.region}.amazonaws.com/${key}`;
}