import { prisma } from "./prisma";
// DB-first helpers — fall back to static if DB empty (keeps dev resilient)
export async function dbGetCategories(){ return prisma.category.findMany({ orderBy:{ label:"asc"}}); }
export async function dbGetArticle(slug: string){
  return prisma.article.findUnique({ where:{slug}, include:{ category:true, author:true, reviewer:true, topics:true }});
}
export async function dbGetArticles(opts?: { categorySlug?: string; take?: number; status?: string }){
  return prisma.article.findMany({
    where:{ ...(opts?.categorySlug ? { category:{ slug: opts.categorySlug }}: {}), ...(opts?.status ? { reviewStatus: opts.status }: { reviewStatus: { not:"draft"} })},
    include:{ category:true, author:true, reviewer:true, topics:true },
    orderBy:{ publishedAt:"desc" },
    take: opts?.take,
  });
}
export async function dbSearchArticles(q: string){
  if(!q) return dbGetArticles();
  return prisma.article.findMany({
    where:{ OR:[{title:{contains:q}},{deck:{contains:q}},{excerpt:{contains:q}}]},
    include:{ category:true, author:true, reviewer:true, topics:true },
    orderBy:{ publishedAt:"desc" },
  });
}
function parseJson<T>(s: string, fallback: T): T { try{ return JSON.parse(s) as T } catch{ return fallback } }
export function mapArticle(db:any){
  if(!db) return null;
  return {
    slug: db.slug, title: db.title, deck: db.deck, excerpt: db.excerpt,
    category: db.category.label, categorySlug: db.category.slug,
    author: { slug: db.author.slug, name: db.author.name, role: db.author.role, bio: db.author.bio, avatar: db.author.avatar },
    reviewer: db.reviewer ? { slug: db.reviewer.slug, name: db.reviewer.name, credentials: db.reviewer.credentials, specialty: db.reviewer.specialty, avatar: db.reviewer.avatar } : undefined,
    featuredImage: db.featuredImage, imageAlt: db.imageAlt, imageCaption: db.imageCaption,
    content: parseJson<any[]>(db.content, []),
    keyTakeaways: parseJson<string[]>(db.keyTakeaways, []),
    faqs: parseJson<{q:string;a:string}[]>(db.faqs, []),
    references: parseJson<{title:string;url:string}[]>(db.references, []),
    publishedAt: db.publishedAt?.toISOString?.() ?? db.publishedAt,
    updatedAt: db.updatedAt?.toISOString?.() ?? db.updatedAt,
    lastReviewed: db.lastReviewed?.toISOString?.() ?? null,
    readingTime: db.readingTime,
    evidenceLevel: db.evidenceLevel,
    reviewStatus: db.reviewStatus,
    topics: db.topics.map((t:any)=>t.label),
  };
}
