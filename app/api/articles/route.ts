import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const take = searchParams.get("take") ? parseInt(searchParams.get("take")!) : undefined;
  const where: any = {};
  if(q) where.OR = [{ title:{ contains: q }},{ deck:{ contains:q }},{ excerpt:{ contains:q }}];
  if(category) where.category = { slug: category };
  const articles = await prisma.article.findMany({ where, include:{ category:true, author:true, reviewer:true, topics:true }, orderBy:{ publishedAt:"desc"}, take });
  return NextResponse.json(articles);
}
export async function POST(req: Request){
  const body = await req.json();
  // Basic validation — in production add Zod + auth check
  const { slug, title, deck, excerpt, content, featuredImage, imageAlt, categoryId, authorId } = body;
  if(!slug || !title || !categoryId || !authorId) return NextResponse.json({ error:"Missing required fields"}, { status:400 });
  const created = await prisma.article.create({ data:{ slug, title, deck: deck||"", excerpt: excerpt||"", content: typeof content==="string"? content: JSON.stringify(content||[]), keyTakeaways: JSON.stringify(body.keyTakeaways||[]), faqs: JSON.stringify(body.faqs||[]), references: JSON.stringify(body.references||[]), featuredImage: featuredImage||"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200", imageAlt: imageAlt||title, categoryId, authorId, readingTime: body.readingTime||5, evidenceLevel: body.evidenceLevel||"General_education", reviewStatus: body.reviewStatus||"draft" }});
  return NextResponse.json(created, { status:201 });
}
