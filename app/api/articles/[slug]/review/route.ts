import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canReviewMedical } from "@/lib/roles";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const reviewerEmail = session?.user?.email;

  if (!canReviewMedical(role)) {
    return NextResponse.json(
      { error: "Forbidden. Only accredited Medical Reviewers or Health Editors can sign off on medical reviews." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { decision, notes, reviewerName } = body; // 'approved' | 'needs_revision' | 'rejected'

  if (!decision) {
    return NextResponse.json({ error: "Review decision is required." }, { status: 400 });
  }

  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const reviewStatus = decision === "approved" ? "medically_reviewed" : "draft";
  const updated = await prisma.article.update({
    where: { slug: params.slug },
    data: {
      reviewStatus,
      lastReviewed: decision === "approved" ? new Date() : article.lastReviewed,
    },
  });

  // Log to Audit trail
  try {
    await prisma.auditLog.create({
      data: {
        action: `MEDICAL_REVIEW_${decision.toUpperCase()}`,
        resource: `Article:${article.slug}`,
        details: JSON.stringify({
          reviewer: reviewerName || reviewerEmail,
          role,
          decision,
          notes,
          timestamp: new Date().toISOString(),
        }),
      },
    });
  } catch {}

  return NextResponse.json({
    ok: true,
    message: `Medical review ${decision} for article "${article.title}".`,
    article: updated,
  });
}
