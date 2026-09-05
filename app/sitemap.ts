import type { MetadataRoute } from "next";
import { articles, authors, reviewers, categories, courses } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

// Sitemap = static site content + CMS-created (database) rows, deduped by path.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  const [dbArticles, dbAuthors, dbReviewers, dbCourses, dbCategories] = await Promise.all([
    prisma.article.findMany({
      where: { reviewStatus: { notIn: ["draft", "pending_medical_review", "scheduled"] } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.author.findMany({ select: { slug: true } }),
    prisma.reviewer.findMany({ select: { slug: true } }),
    prisma.course.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticPaths = [
    "", "/mental-health","/general-health","/prevention","/relationships","/family-parenting","/workplace","/environment","/social","/training","/campaigns","/about","/help","/contact","/search","/authors","/reviewers","/privacy","/terms","/disclaimer","/editorial-policy","/medical-review","/newsletter","/about-the-founder",
  ];

  const lastMod = (row: Record<string, unknown>) => {
    const u = row.updatedAt;
    if (!u) return now;
    const d = new Date(u as string | number | Date);
    return Number.isNaN(d.getTime()) ? now : d;
  };

  const seen = new Set<string>();
  const merged: { path: string; lastModified: Date }[] = [];
  const push = (path: string, lastModified: Date) => {
    if (seen.has(path)) return;
    seen.add(path);
    merged.push({ path, lastModified });
  };

  staticPaths.forEach((p) => push(p, now));
  [...articles, ...dbArticles].forEach((a) => push(`/articles/${a.slug}`, lastMod(a)));
  [...authors, ...dbAuthors].forEach((a) => push(`/authors/${a.slug}`, lastMod(a)));
  [...reviewers, ...dbReviewers].forEach((r) => push(`/reviewers/${r.slug}`, lastMod(r)));
  [...courses, ...dbCourses].forEach((c) => push(`/training/${c.slug}`, lastMod(c)));
  [...categories, ...dbCategories].forEach((c) => push(`/${c.slug}`, lastMod(c)));

  return merged.map((e) => ({ url: `${base}${e.path || "/"}`, lastModified: e.lastModified }));
}