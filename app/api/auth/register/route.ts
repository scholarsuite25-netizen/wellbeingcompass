import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail, welcomeHtml } from "@/lib/email";
import { env } from "@/lib/env";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional().nullable(),
  role: z.string().optional().default("READER"),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`register:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        password: hashedPassword,
        phone: parsed.data.phone || null,
        role: parsed.data.role || "READER",
        isSubscribed: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSubscribed: true,
        createdAt: true,
      },
    });

    // 1. Auto-Subscribe user to newsletter
    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: { email, source: "registration" },
      });
    } catch (subErr) {
      console.error("[register] auto-subscribe error:", subErr);
    }

    // 2. Auto-Send Welcome Email with starter health education & coping articles
    try {
      const welcomeSubject = `Welcome to ${env.NEXT_PUBLIC_SITE_NAME}, ${user.name || "Friend"}!`;
      const welcomeBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #17212B; line-height: 1.6;">
          <h1 style="color: #0D2A4A; font-size: 24px;">Welcome to Wellbeing Compass!</h1>
          <p>Hi ${user.name || "there"},</p>
          <p>Thank you for joining our community. Your account is ready, and you have been automatically subscribed to our evidence-informed weekly health newsletter.</p>
          
          <div style="background-color: #EAF3FB; border-left: 4px solid #1565C0; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0D2A4A;">🧭 Recommended Starter Articles For You:</h3>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li><a href="${env.NEXT_PUBLIC_SITE_URL}/articles/understanding-everyday-anxiety" style="color: #1565C0; font-weight: bold;">Understanding Everyday Anxiety: When Worry Is Normal and When to Seek Support</a></li>
              <li><a href="${env.NEXT_PUBLIC_SITE_URL}/articles/sleep-hygiene-guide" style="color: #1565C0; font-weight: bold;">Sleep Hygiene: A Simple Guide to Better Nights</a></li>
              <li><a href="${env.NEXT_PUBLIC_SITE_URL}/articles/preventive-care-checkups" style="color: #1565C0; font-weight: bold;">Preventive Care: Why Regular Checkups Matter More Than You Think</a></li>
            </ul>
          </div>

          <p>You can also enroll in our free guided training courses such as <b>Stress Management 101</b> at <a href="${env.NEXT_PUBLIC_SITE_URL}/training" style="color: #1565C0;">${env.NEXT_PUBLIC_SITE_URL}/training</a>.</p>
          
          <p style="font-size: 12px; color: #5E6B76; margin-top: 30px; border-top: 1px solid #D9E2EA; padding-top: 10px;">
            <b>Educational notice:</b> Wellbeing Compass provides trusted health and mental wellbeing education, not personalized clinical diagnosis or emergency care. If you need urgent support, visit our <a href="${env.NEXT_PUBLIC_SITE_URL}/help">Help & Crisis resources</a>.
          </p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: welcomeSubject,
        html: welcomeBody,
        text: `Welcome to Wellbeing Compass, ${user.name}! Your account is active and you are auto-subscribed to our health updates.`,
      });
    } catch (emailErr) {
      console.error("[register] welcome email error:", emailErr);
    }

    // 3. Log Audit Record
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_REGISTERED",
          resource: "User",
          details: JSON.stringify({ email, role: user.role, autoSubscribed: true }),
        },
      });
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        message: "Account created successfully with auto-subscription and welcome articles sent.",
        user,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[register] uncaught error:", err);
    return NextResponse.json({ error: "Server error occurred during registration." }, { status: 500 });
  }
}
