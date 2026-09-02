import { env } from "./env";

// Env-driven email: console (dev) or resend (prod)
// Usage: await sendEmail({ to, subject, html })

type SendOpts = { to: string; subject: string; html: string; text?: string };

export async function sendEmail(opts: SendOpts) {
  const provider = env.EMAIL_PROVIDER;

  if (provider === "resend") {
    if (!env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY missing while EMAIL_PROVIDER=resend — falling back to console");
      console.log(`[email:console-fallback] to=${opts.to} subject=${opts.subject}\n${opts.html}`);
      return { id: "console-fallback", provider: "console" as const };
    }
    // Lazy import not needed — simple fetch to Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend error ${res.status}: ${body}`);
    }
    const data = (await res.json()) as { id: string };
    return { id: data.id, provider: "resend" as const };
  }

  // console provider — safe for dev, logs to server, never leaks secrets
  console.log(`[email:console] from=${env.EMAIL_FROM} to=${opts.to} subject=${opts.subject}\n${opts.html}`);
  return { id: `console-${Date.now()}`, provider: "console" as const };
}

export function welcomeHtml(email: string) {
  return `<p>Thanks for subscribing to <b>${env.NEXT_PUBLIC_SITE_NAME}</b> — ${email}!</p><p>You'll get evidence-informed health stories weekly. Unsubscribe anytime.</p>`;
}
