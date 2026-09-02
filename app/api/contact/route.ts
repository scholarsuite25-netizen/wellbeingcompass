import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json().catch(()=> ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });

  const to = env.CONTACT_TO_EMAIL || env.EMAIL_FROM;
  const html = `<h2>New contact from ${env.NEXT_PUBLIC_SITE_NAME}</h2>
  <p><b>Name:</b> ${escapeHtml(parsed.data.name)}<br/><b>Email:</b> ${escapeHtml(parsed.data.email)}</p>
  <p>${escapeHtml(parsed.data.message).replace(/\n/g,"<br/>")}</p>
  <p style="color:#5E6B76;font-size:12px">Sent via ${env.NEXT_PUBLIC_SITE_URL}/contact — IP rate-limited (${env.RATE_LIMIT_MAX}/${env.RATE_LIMIT_WINDOW_MS}ms).</p>`;

  await sendEmail({ to, subject: `Contact: ${parsed.data.name} via ${env.NEXT_PUBLIC_SITE_NAME}`, html, text: parsed.data.message });

  // Also log contact as audit if needed — here just return ok
  return NextResponse.json({ ok: true, provider: env.EMAIL_PROVIDER, to }, { status: 201 });
}

function escapeHtml(s: string){ return s.replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); }
