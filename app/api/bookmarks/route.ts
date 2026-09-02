import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      article: {
        include: { category: true, author: true, reviewer: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { articleId } = body;
  if (!articleId) return NextResponse.json({ error: "articleId is required" }, { status: 400 });

  const existing = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ bookmarked: false, message: "Bookmark removed" });
  } else {
    const created = await prisma.bookmark.create({
      data: { userId, articleId },
    });
    return NextResponse.json({ bookmarked: true, bookmark: created }, { status: 201 });
  }
}
