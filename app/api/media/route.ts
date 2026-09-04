import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes } from "crypto";
import { storeImage } from "@/lib/storage";

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
  if (!dataUrl) return NextResponse.json({ error: "No image data provided" }, { status: 400 });

  const m = /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return NextResponse.json({ error: "Invalid image data URL — expected data:image/<png|jpeg|webp|gif>;base64,…" }, { status: 400 });

  const mime = m[1];
  const ext = ALLOWED[mime];
  if (!ext) return NextResponse.json({ error: "Unsupported image type. Allowed: PNG, JPEG, WebP, GIF." }, { status: 415 });

  let buffer: Buffer;
  try {
    buffer = Buffer.from(m[2], "base64");
  } catch {
    return NextResponse.json({ error: "Invalid base64 payload" }, { status: 400 });
  }
  if (buffer.length === 0) return NextResponse.json({ error: "Empty image data" }, { status: 400 });
  if (buffer.length > MAX_BYTES) return NextResponse.json({ error: "Image exceeds 3MB limit" }, { status: 413 });

  const filename = `img-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const stored = await storeImage({ buffer, mime, ext, filename });

  return NextResponse.json({
    url: stored.url,
    storageProvider: stored.storageProvider,
    durable: stored.durable,
  });
}