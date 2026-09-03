import { prisma } from "./prisma";
import { sendEmail } from "./email";
import { env } from "./env";

// Automatic notifications to registered subscribers when a new article is published.
// Email uses the configured EMAIL_PROVIDER (console in dev, resend in prod).
// WhatsApp requires Meta Cloud API credentials (WHATSAPP_TOKEN + WHATSAPP_PHONE_ID).
// This returns a summary so callers can log/audit the result.

type NewArticle = {
  title: string;
  url: string;
  excerpt: string;
};

export async function notifyMembersAboutArticle(article: NewArticle): Promise<{ emailed: number; whatsapped: number; skippedEmail: number; skippedWhatsApp: number }> {
  const result = { emailed: 0, whatsapped: 0, skippedEmail: 0, skippedWhatsApp: 0 };

  // Subscribers = registered users (email) with isSubscribed = true
  const subscribers = await prisma.user.findMany({
    where: { isSubscribed: true, email: { not: null } },
    select: { email: true },
  }).catch((e) => {
    console.error("[notify] could not load subscribers:", e.message);
    return [];
  });

  const html = `<h2>${article.title}</h2><p>${article.excerpt}</p><a href="${article.url}">Read the full article</a>`;

  for (const s of subscribers) {
    const email = s.email!;
    try {
      const r = await sendEmail({ to: email, subject: `New article: ${article.title}`, html, text: article.excerpt });
      if (r.provider === "console") result.skippedEmail++; else result.emailed++;
    } catch (e) {
      console.error(`[notify] email failed for ${email}:`, (e as Error).message);
    }
  }

  // WhatsApp to members who have a phone number on record (if configured)
  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID) {
    const withPhone = await prisma.user.findMany({
      where: { phone: { not: null } },
      select: { phone: true },
    }).catch(() => []);

    for (const u of withPhone) {
      if (!u.phone) continue;
      try {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${env.WHATSAPP_PHONE_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: u.phone,
              type: "text",
              text: { body: `🆕 ${article.title}\n\n${article.excerpt}\n\n${article.url}` },
            }),
          }
        );
        if (res.ok) result.whatsapped++; else result.skippedWhatsApp++;
      } catch (e) {
        console.error(`[notify] whatsapp failed for ${u.phone}:`, (e as Error).message);
      }
    }
  } else {
    console.warn("[notify] WHATSAPP_TOKEN/WHATSAPP_PHONE_ID not set — skipping WhatsApp notifications.");
  }

  return result;
}
