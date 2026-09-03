import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyMembersAboutArticle } from "@/lib/notify";
import { autopost } from "@/lib/autopost";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// Trigger member notifications + social autopost when an article is published.
// Authorized by a shared secret (PUBLISH_SECRET) or a valid editor/admin session.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const slug = String(body?.slug || "").trim();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const secret = req.headers.get("x-publish-secret");
  if (process.env.PUBLISH_SECRET && secret !== process.env.PUBLISH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, reviewStatus: true },
  });
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  if (article.reviewStatus !== "published") {
    return NextResponse.json({ error: "Article not published yet" }, { status: 400 });
  }

  const url = `${env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`;

  const [notifyResult, postResult] = await Promise.allSettled([
    notifyMembersAboutArticle({ title: article.title, excerpt: article.excerpt, url }),
    autopost({ text: article.title, url, image: undefined }),
  ]);

  return NextResponse.json({
    ok: true,
    notify: notifyResult.status === "fulfilled" ? notifyResult.value : { error: String(notifyResult.reason) },
    autopost: postResult.status === "fulfilled" ? postResult.value : { error: String(postResult.reason) },
  });
}
