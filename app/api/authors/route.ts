import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const a = await prisma.author.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(a);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Author name is required" }, { status: 400 });

  const rawSlug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim()
      : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!rawSlug) return NextResponse.json({ error: "Invalid author name" }, { status: 400 });

  let slug = rawSlug;
  let existing = await prisma.author.findUnique({ where: { slug } });
  let n = 2;
  while (existing) {
    slug = `${rawSlug}-${n}`;
    existing = await prisma.author.findUnique({ where: { slug } });
    n += 1;
  }

  const created = await prisma.author.create({
    data: {
      slug,
      name,
      role: typeof body.role === "string" && body.role.trim() ? body.role.trim() : "Contributor",
      bio: typeof body.bio === "string" && body.bio.trim() ? body.bio.trim() : `${name} is a contributor to Wellbeing Compass.`,
      avatar:
        typeof body.avatar === "string" && body.avatar.trim()
          ? body.avatar.trim()
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
  });
  return NextResponse.json(created, { status: 201 });
}