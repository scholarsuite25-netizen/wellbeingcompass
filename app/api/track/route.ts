import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Lightweight self-hosted pageview tracking (sendBeacon JSON)
export async function POST(req: NextRequest) {
  try {
    let path = "/";
    let referrer: string | undefined;
    try {
      const body = await req.json();
      path = (body?.path || "/").slice(0, 500);
      referrer = (body?.ref || undefined)?.slice(0, 500);
    } catch { /* empty body */ }

    if (path.startsWith("/api/")) return NextResponse.json({ ok: true });

    await prisma.pageView.create({
      data: { path, referrer },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Non-fatal — analytics should never break the site
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
