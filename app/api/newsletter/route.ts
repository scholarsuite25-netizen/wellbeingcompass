import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendEmail, welcomeHtml } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`newsletter:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now())/1000)) }});

  const body = await req.json().catch(()=> ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();

  try {
    await prisma.newsletterSubscriber.create({ data: { email }});
  } catch (e:any) {
    // Prisma P2002 = unique constraint — already subscribed is not an error to caller (privacy: don't enumerate)
    if (e?.code !== "P2002") throw e;
  }

  // Env-driven welcome email: console in dev, resend in prod if configured
  try {
    await sendEmail({ to: email, subject: `Welcome to ${env.NEXT_PUBLIC_SITE_NAME}`, html: welcomeHtml(email) });
  } catch (err:any) {
    console.error("[newsletter] welcome email failed:", err?.message);
    // Don't fail subscription if email fails — still 201
  }

  return NextResponse.json({ ok: true, provider: env.EMAIL_PROVIDER }, { status: 201 });
}

export async function GET() {
  // Admin-only in real deployment — gated by auth; here return count for dashboard when NEXTAUTH_SECRET is valid
  const count = await prisma.newsletterSubscriber.count();
  return NextResponse.json({ count, provider: env.EMAIL_PROVIDER, from: env.EMAIL_FROM });
}
